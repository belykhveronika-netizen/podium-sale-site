#!/usr/bin/env python3
"""Зеркалирует фото каталога и курс евро на домен сайта.

Зачем: у части пользователей в РФ зарубежные хосты (Supabase, Швеция) без VPN
открываются очень медленно или не открываются. Всё, что нужно для показа
каталога, должно лежать на том же домене, что и сайт.

Что делает (запускается из .github/workflows/sync-catalog.yml после выгрузки lamps.json):
  1. Для каждого светильника скачивает фото из Supabase Storage в img/<имя>
     (только если файла ещё нет; ужимает до 1000 px по большей стороне).
  2. Дописывает в lamps.json поле image_local = "img/<имя>" там, где файл есть.
  3. Пишет rate.json {"rate": N} с курсом евро из таблицы settings.
Ошибки по отдельным файлам не валят скрипт: сайт откатится на оригинальный URL.
"""
import json, os, sys, urllib.request, urllib.parse, io

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, 'img')
MAX_SIDE = 1000
THUMB_SIDE = 480
THUMB_DIR = os.path.join(IMG_DIR, 't')
SUPABASE_URL = os.environ.get('SUPABASE_URL', '').rstrip('/')
KEY = os.environ.get('SUPABASE_ANON_KEY', '')

try:
    from PIL import Image
except ImportError:
    Image = None


def get(url, timeout=30):
    req = urllib.request.Request(url, headers={'apikey': KEY, 'Authorization': 'Bearer ' + KEY})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def shrink(data, name, side=None, quality=82):
    side = side or MAX_SIDE
    if Image is None:
        return data
    try:
        im = Image.open(io.BytesIO(data))
        im.load()
        if max(im.size) <= side:
            return data
        im.thumbnail((side, side))
        out = io.BytesIO()
        ext = name.rsplit('.', 1)[-1].lower()
        if ext in ('jpg', 'jpeg'):
            im.convert('RGB').save(out, 'JPEG', quality=quality, optimize=True)
        elif ext == 'png':
            im.save(out, 'PNG', optimize=True)
        elif ext == 'webp':
            im.save(out, 'WEBP', quality=quality)
        else:
            return data
        return out.getvalue()
    except Exception as e:
        print('  resize skipped for', name, e)
        return data


def main():
    os.makedirs(THUMB_DIR, exist_ok=True)
    path = os.path.join(ROOT, 'lamps.json')
    lamps = json.load(open(path, encoding='utf-8'))
    if not isinstance(lamps, list) or not lamps:
        print('lamps.json пуст или не список — ничего не делаю')
        return 0

    ok = fail = new = 0
    for l in lamps:
        url = l.get('image') or ''
        if 'supabase.co' not in url:
            continue
        name = urllib.parse.unquote(url.rsplit('/', 1)[-1])
        if not name or '/' in name or name.startswith('.'):
            continue
        dest = os.path.join(IMG_DIR, name)
        if not os.path.exists(dest):
            try:
                data = shrink(get(url), name)
                with open(dest, 'wb') as f:
                    f.write(data)
                new += 1
            except Exception as e:
                print('  не скачалось', url, e)
                fail += 1
                continue
        l['image_local'] = 'img/' + urllib.parse.quote(name)
        # Лёгкое превью для карточек сетки (480 px) — в разы меньше оригинала
        tdest = os.path.join(THUMB_DIR, name)
        if not os.path.exists(tdest):
            try:
                with open(dest, 'rb') as f:
                    tdata = shrink(f.read(), name, THUMB_SIDE, 78)
                with open(tdest, 'wb') as f:
                    f.write(tdata)
            except Exception as e:
                print('  превью не создано', name, e)
        if os.path.exists(tdest):
            l['image_thumb'] = 'img/t/' + urllib.parse.quote(name)
        ok += 1

    json.dump(lamps, open(path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'images: ok={ok} new={new} failed={fail}')

    try:
        rows = json.loads(get(f'{SUPABASE_URL}/rest/v1/settings?select=value&key=eq.eur_rate'))
        rate = float(rows[0]['value'])
        if rate > 0:
            json.dump({'rate': rate}, open(os.path.join(ROOT, 'rate.json'), 'w'))
            print('rate:', rate)
    except Exception as e:
        print('rate.json не обновлён:', e)
    return 0


if __name__ == '__main__':
    sys.exit(main())

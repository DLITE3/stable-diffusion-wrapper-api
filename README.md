# Hono API
This API is created by Hono.

## Development environment
Wrangler + Hono + TypeScript

## Command
develop(loalhost)
```sh
wrangker dev
```
deploy(cloudflare wokers)
```sh
wrangler deploy
```

## Image to search song names
Sample code. (Python)
API URL -> https://discord.com/channels/1255432145749409863/1255454068650934374/1309100236710613023
```py
import requests
import base64
from io import BytesIO
from PIL import Image

def base64_to_image(base64_string: str) -> Image.Image:
    """
    Base64文字列をPillowのImageオブジェクトに変換する

    :param base64_string: Base64エンコードされた画像データ
    :return: Imageオブジェクト
    """
    try:
        # Base64文字列からバイナリデータにデコード
        image_data = base64.b64decode(base64_string)
        # BytesIOオブジェクトを作成
        image_buffer = BytesIO(image_data)
        # PillowのImageオブジェクトに変換
        image = Image.open(image_buffer)
        return image
    except Exception as e:
        print(f"Error decoding Base64 string: {e}")
        raise

def post_data():
    url = "http://hogehoge.foobar/generate-image"
    data = {
        "query": "cyberpunk floating city"
    }
    response = requests.post(url, json=data)
    return response.json()

def main():
    data = post_data()
    # Base64文字列を取得
    base64_image = data.get("image")
    if base64_image:
        # Base64文字列をバイナリデータに変換
        image_data = base64.b64decode(base64_image)

        # 画像ファイルとして保存
        with open("output_image.jpeg", "wb") as f:
            f.write(image_data)
        print("画像が保存されました: output_image.jpeg")
    else:
        print("画像データがレスポンスに含まれていません。")

if __name__ == "__main__":
    main()  
```

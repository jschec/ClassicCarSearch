# from PIL import Image
import numpy as np
import webcolors
import math
from typing import Tuple, Any, List
import cv2
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import json
import requests


def get_main_color(image_array: Any) -> Tuple[float, float, float]:
    # image = cv2.imread(image_path)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # crop the image
    height, width = image.shape[:2]
    x = width // 8
    y = height // 8
    w = width * 3 // 4
    h = height * 3 // 4
    cropped_image = image[y:y+h, x:x+w]

    # convert to rgb
    image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2RGB)

    # plt.imshow(image)
    # plt.axis('off')
    # plt.show()

    pixels = image.reshape(-1, 3)

    kmeans = KMeans(n_clusters=2, n_init=10)  # kmean
    kmeans.fit(pixels)
    colors = kmeans.cluster_centers_
    # print(colors)

    # plt.imshow([colors.astype(np.uint8)])
    # plt.axis('off')
    # plt.show()

    return colors[0]


def convert_hex_to_rgb(hex_string: str):
    # remove '#'
    hex_value = hex_string.strip('#')

    # convert hex to rgb
    r = int(hex_value[0:2], 16)
    g = int(hex_value[2:4], 16)
    b = int(hex_value[4:6], 16)

    # return rgb tuple
    return (r, g, b)

def rgb_to_color_name(rgb: Tuple[float, float, float]):
    min_distance = math.inf
    closest_color_name = "Unknown"
    for color_name, color_rgb_str in webcolors.CSS3_NAMES_TO_HEX.items():
        # calculate color diff
        color_rgb = convert_hex_to_rgb(color_rgb_str)
        r_diff = rgb[0] - color_rgb[0]
        g_diff = rgb[1] - color_rgb[1]
        b_diff = rgb[2] - color_rgb[2]

        # caculate distance
        distance = math.sqrt(r_diff**2 + g_diff**2 + b_diff**2)

        # update min disntance and color name
        if distance < min_distance:
            min_distance = distance
            closest_color_name = color_name

    return closest_color_name

def main():
    i = 0
    with open('../data/cars.json', 'r') as file:
        data = json.load(file)
        result: List[Any] = []
        for item in data:
            image_url = item['img']
            response = requests.get(image_url)
            if response.status_code == 200:
                # read image data from buff
                image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
                main_color = get_main_color(image_array)
                print(image_url);
                color_name = rgb_to_color_name(main_color)
                print('Main Color:', main_color, 'Color Name:', color_name)
                item['color'] = color_name
                result.append(item)
            else:
                continue
    with open('../data/extracted_color_cars.json', 'w') as file:
        json.dump(result, file, indent=4)


if __name__ == '__main__':
    main()
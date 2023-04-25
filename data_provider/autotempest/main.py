import asyncio
import hashlib
import json
import time

import aiohttp
import mongo_utils

BACKEND_API = "https://www.autotempest.com/queue-results"

QUERY_PARAMETER = {
    "domesticonly": 0,
    "localization": "any",
    "minyear": 1900,
    "maxyear": 1980,
    "radius": 12999,
    "minradius": 500,
    "showUnpaid": 0,
    "showPrivate": 0,
    "zip": 98007,
    "sort": "best_match",
    "sites": "cm",
    "deduplicationSites": "te|cm|cs|cv|eb|tc|ot|st|fbm",
    "rpp": 50,
    "page": 1,
}


def get_request_url_by_page(page: int) -> str:
    # combine query_string
    parameter = QUERY_PARAMETER.copy()
    parameter["page"] = page
    query_string = ""
    for item in parameter.items():
        if query_string != "":
            query_string += "&"
        query_string = query_string + f"{item[0]}={item[1]}"
    # hash token
    sha256_obj = hashlib.sha256()
    hash_string = (
        query_string
        + "d8007486d73c168684860aae427ea1f9d74e502b06d94609691f5f4f2704a07f"
    )
    sha256_obj.update(hash_string.encode())
    token = sha256_obj.hexdigest()
    return BACKEND_API + "?" + query_string + "&token=" + token


async def query(url: str) -> str:
    print("Start query:", url)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(url) as response:
            content = await response.text()
            return content


async def run_entry():
    for page in range(1, 10):
        print("========", f"Start request page {page}" ,"========")
        url = get_request_url_by_page(page)
        content = await query(url)
        result_obj = json.loads(content)
        for item in result_obj["results"]:
            mongo_utils.update_record(item)
        print("========", f"Write page {page} finish, sleep 1 second" ,"========")
        # time.sleep(1)

def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run_entry())


if __name__ == "__main__":
    main()

""" This code is mainly similar with
    that in https://docs.microsoft.com/ko-kr/azure/cognitive-services/text-analytics/quickstarts/text-analytics-sdk
"""
import os
import logging
import argparse
import requests

logging.getLogger().setLevel(logging.INFO)


def get_key_phrases(documents):
    """get key phrases using Azure Text Analytics API"""

    key_var_name = 'TEXT_ANALYTICS_SUBSCRIPTION_KEY'
    if not key_var_name in os.environ:
        raise Exception('Please set/export the environment variable: {}'.format(key_var_name))
    subscription_key = os.environ[key_var_name]

    endpoint_var_name = 'TEXT_ANALYTICS_ENDPOINT'
    if not endpoint_var_name in os.environ:
        raise Exception('Please set/export the environment variable: {}'.format(endpoint_var_name))
    endpoint = os.environ[endpoint_var_name]

    keyphrase_url = endpoint + "/text/analytics/v2.1/keyphrases"

    headers = {"Ocp-Apim-Subscription-Key": subscription_key}
    response = requests.post(keyphrase_url, headers=headers, json=documents)
    logging.info("[Text Analytics API] a request for extracting keywords")

    if response.status_code != 200:
        logging.warning("[Text Analytics API] error code %d", response.status_code)
        return None

    return response.json()

if __name__ == '__main__':
    # pylint: disable=invalid-name
    parser = argparse.ArgumentParser()
    parser.add_argument('--data_file', '-f', type=str, required=True, help="file to extract key phrases")
    args = parser.parse_args()
    get_key_phrases(args.data_file)
    # pylint: enable=invalid-name

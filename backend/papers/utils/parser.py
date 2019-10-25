"""parser.py"""
import argparse
import csv
import json
import re
import os
import sys

csv.field_size_limit(sys.maxsize)

FIXTURE_DIR = '../fixtures'
PUBLICATION_TYPE_DICT = {
    'J': 'journal',
    'B': 'book',
    'S': 'series',
    'P': 'patent'
}
MONTH_DICT = {
    'JAN': '01',
    'FEB': '02',
    'MAR': '03',
    'APR': '04',
    'MAY': '05',
    'JUN': '06',
    'JUL': '07',
    'AUG': '08',
    'SEP': '09',
    'OCT': '10',
    'NOV': '11',
    'DEC': '12',

    'FAL': '9',
    'WIN': '12'
}

# pylint: disable=too-many-locals, too-many-statements
def get_papers(filename):
    """parser"""
    reader = csv.DictReader(open(filename, 'r', encoding='utf-16'), dialect='excel-tab')
    # pylint: disable=invalid-name
    pk = {
        "paper": 0,
        "author": 0,
        "paper_author": 0,
        "publisher": 0,
        "publication": 0,
        "paper_publication": 0
    }
    # pylint: enable=invalid-name
    papers = []
    authors = []
    paper_authors = []
    publishers = []
    publications = []
    paper_publications = []

    address_pattern = re.compile(r'(\[.*?\].*?)\;')
    address_author_pattern = re.compile(r'\[.*?\]')

    for row in reader:
        pk['paper'] += 1
        paper_fields = {
            "title": row['TI'],
            "language": row['LA'],
            "abstract": row['AB'],
            "ISSN": row['SN'],
            "eISSN": row['EI'],
            "DOI": row['DI'],
        }
        paper = {
            "model": "papers.paper",
            "pk": pk['paper'],
            "fields": paper_fields
        }
        papers.append(paper)

        authors_name = list(map(str.strip, row['AF'].split(';')))
        emails = row['EM'].split(';')
        addresses = list(filter(len, address_pattern.split(row['C1'])))
        researcher_ids = row['RI'].split(';')

        author_rank = 0
        for author_name in authors_name:
            pk['author'] += 1
            author_rank += 1
            address = ''
            researcher_id = ''
            for addr in addresses:
                if author_name.lower() in addr.lower():
                    address = re.sub(address_author_pattern, '', addr).strip()
                    break
            for res_id in researcher_ids:
                if author_name.lower() in res_id.lower():
                    researcher_id = res_id.split('/')[1].strip()
                    break

            first_last = author_name.split(',')
            first_name = first_last[0].strip()
            last_name = first_last[1].strip() if len(first_last) > 1 else ''
            author_fields = {
                "first_name": first_name,
                "last_name": last_name,
                "email": emails.pop(0).strip() if emails else '',
                "address": address,
                "researcher_id": researcher_id.strip()
            }
            author = {
                "model": "papers.author",
                "pk": pk['author'],
                "fields": author_fields
            }
            authors.append(author)

            pk['paper_author'] += 1
            paper_author = {
                "model": "papers.paperauthor",
                "pk": pk['paper_author'],
                "fields": {
                    "paper": pk['paper'],
                    "author": pk['author'],
                    "author_type": 'general',
                    "rank": author_rank
                }
            }
            paper_authors.append(paper_author)

        pk['publisher'] += 1
        publisher_fields = {
            "name": row['PU'],
            "city": row['PI'],
            "address": row['PA']
        }
        publisher = {
            "model": "papers.publisher",
            "pk": pk['publisher'],
            "fields": publisher_fields
        }
        publishers.append(publisher)

        pk['publication'] += 1
        publication_fields = {
            "name": row['SO'],
            "publication_type": PUBLICATION_TYPE_DICT[row['PT']],
            "publisher": pk['publisher']
        }
        publication = {
            "model": "papers.publication",
            "pk": pk['publication'],
            "fields": publication_fields
        }
        publications.append(publication)

        pk['paper_publication'] += 1
        month_day = row['PD'].split()
        month = MONTH_DICT[month_day[0].split('-')[0].strip()] if month_day else '01'
        day = "{0:0>2}".format(month_day[1]) if len(month_day) > 1 else '01'
        date = row['PY'] + '-' + month + '-' + day if row['PY'] else None
        paper_publication = {
            "model": "papers.paperpublication",
            "pk": pk['paper_publication'],
            "fields": {
                "paper": pk['paper'],
                "publication": pk['publication'],
                "volume": row['VL'] if row['VL'] else None,
                "issue": row['IS'] if row['IS'] else None,
                "date": date,
                "beginning_page": row['BP'] if row['BP'].isdigit() else None,
                "ending_page": row['EP'] if row['EP'].isdigit() else None,
                "ISBN": row['BN']
            }
        }
        paper_publications.append(paper_publication)

    models = papers + authors + paper_authors + publishers + publications + paper_publications
    json_filename = filename.split('.')[0].strip() + '.json'
    json.dump(models, open(os.path.join(FIXTURE_DIR, json_filename), 'w'), indent=4)
# pylint: enable=too-many-locals, too-many-statements

if __name__ == '__main__':
    # pylint: disable=invalid-name
    parser = argparse.ArgumentParser()
    parser.add_argument('--data_file', '-f', type=str, required=True, help="file to parse")
    args = parser.parse_args()
    get_papers(args.data_file)
    # pylint: enable=invalid-name

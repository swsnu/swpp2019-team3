# PapersFeed [![Build Status](https://travis-ci.com/swsnu/swpp2019-team3.svg?branch=master)](https://travis-ci.com/swsnu/swpp2019-team3) [![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2019-team3/badge.svg?branch=master)](https://coveralls.io/github/swsnu/swpp2019-team3?branch=master) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2019-team3&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2019-team3)

## https://www.papersfeed.online

## How to Run
### 1. Clone this repository
`git clone https://github.com/swsnu/swpp2019-team3.git`

### 2. Prepare basic environment for PapersFeed
Maybe you don't have to follow all steps. These steps assume you have a clean **Linux 18.04 LTS machine**. We checked these steps make your environment possible to run PapersFeed on **Linux 18.04 LTS**.

**(1) virtual environment**
```
sudo apt-get install python3-setuptools
sudo apt update
sudo apt install python3-pip
sudo apt-get install python3-virtualenv
pip3 install virtualenv
sudo apt install virtualenv
virtualenv --python=python3 papersfeed
source papersfeed/bin/activate
```

**(2) MySQL**
```
sudo apt-get install mysql-server
sudo mysql_secure_installation
———
sudo mysql -u root -p
mysql> CREATE DATABASE PapersFeed_DB;
mysql> CREATE USER 'PapersFeed'@'localhost' IDENTIFIED WITH mysql_native_password BY 'swpp2019team3';
mysql> GRANT ALL PRIVILEGES ON *.* to 'PapersFeed'@'localhost';
exit
———
sudo apt-get install libmysqlclient-dev
sudo apt-get install libssl-dev
```

**(3) migrate**
```
cd swpp2019-team3/backend
python3 manage.py migrate (in swpp2019-team3/backend)
```

**(4) installing requirements for backend**
```
cd ..
pip3 install -r requirements.txt (in swpp2019-team3)
```

**(5) npm**
```
sudo apt-get install npm
sudo npm install -g yarn
```

**(6) installing requirements for frontend**
```
cd frontend
yarn install (in swpp2019-team3/frontend)
```

### 3. Install Redis and Run Celery and Redis
Please refer to **Setting Environment** of [this PR](https://github.com/swsnu/swpp2019-team3/pull/181).

### 4. Set Environment Variables for Text Analytics
Unless you set environment variables for Text Analytics, our backend codes raise exceptions saying `Please set/export the environment variable`. So please set or export them. You can use any string for stub key and endpoint. Of course, in that case, extracting keywords from papers will not work!
```
export TEXT_ANALYTICS_SUBSCRIPTION_KEY=something
export TEXT_ANALYTICS_ENDPOINT=https://koreacentral.api.cognitive.microsoft.com/
```

### 5. Run Backend and Frontend
In `swpp2019-team3/backend`,
```
python3 manage.py runserver
```

In `swpp2019-team3/frontend`,
```
yarn start
```

### References related with Possible Problems
**1. MySQL config**

If you have some problems related with the connection between Django and MySQL, please refer to [this PR](https://github.com/swsnu/swpp2019-team3/pull/10).


## How to Test
In `swpp2019-team3/backend`,
```
python3 manage.py test
```
or
```
coverage run --source='.' ./manage.py test
coverage report --fail-under=90
```
a
In `swpp2019-team3/frontend`,
```
yarn test --coverage --watchAll=false
```

## Demo Video
https://youtu.be/d4GE50Vv4Sk

## Wiki
You can refer to [our wiki](https://github.com/swsnu/swpp2019-team3/wiki) for detailed information.

## API document
For information of our APIs, you can visit [here](https://www.papersfeed.online/static/apidoc/apidoc.html).
Also when running backend on your machine, you can also use [this link](http://localhost:8000/static/apidoc/apidoc.html).

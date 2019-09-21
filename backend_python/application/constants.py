# -*- coding: utf-8 -*-

"""
  _    _ _______ _______ _____    _____  ______  _____ _____   ____  _   _  _____ ______    _____ ____  _____  ______
 | |  | |__   __|__   __|  __ \  |  __ \|  ____|/ ____|  __ \ / __ \| \ | |/ ____|  ____|  / ____/ __ \|  __ \|  ____|
 | |__| |  | |     | |  | |__) | | |__) | |__  | (___ | |__) | |  | |  \| | (___ | |__    | |   | |  | | |  | | |__
 |  __  |  | |     | |  |  ___/  |  _  /|  __|  \___ \|  ___/| |  | | . ` |\___ \|  __|   | |   | |  | | |  | |  __|
 | |  | |  | |     | |  | |      | | \ \| |____ ____) | |    | |__| | |\  |____) | |____  | |___| |__| | |__| | |____
 |_|  |_|  |_|     |_|  |_|      |_|  \_\______|_____/|_|     \____/|_| \_|_____/|______|  \_____\____/|_____/|______|

# Http Response Code

"""
AuthError = 207  # 인증 오류, 권한 없음 혹은 비밀번호 오류
ParameterError = 208  # 필수 파라미터 에러
NotAvailableAPI = 209  # 지원하지 않는 API 버전
InvalidSession = 210  # 잘못된 세션
NotExistObject = 211  # 존재하지 않는 Object
InvalidEmail = 212  # 유효하지 않은 이메일
AlreadyExistEmail = 213  # 이미 존재하는 이메일
ContentRequired = 214  # 하나 이상의 Content가 있어야함
InvalidPlace = 215  # Invalid Place ID
AlreadyExistUserName = 216  # 이미 존재하는 사용자 이름
InvalidFacebookToken = 217  # 잘못된 Facebook Token
NotExistGeometry = 218  # 위도, 경도를 알 수 없음
InvalidDevice = 219  # Invalid Device

"""
   _____ ____  __  __ __  __  ____  _   _ 
  / ____/ __ \|  \/  |  \/  |/ __ \| \ | |
 | |   | |  | | \  / | \  / | |  | |  \| |
 | |   | |  | | |\/| | |\/| | |  | | . ` |
 | |___| |__| | |  | | |  | | |__| | |\  |
  \_____\____/|_|  |_|_|  |_|\____/|_| \_|

# Common

"""
DATA = 'data'
DEBUG = 'debug'
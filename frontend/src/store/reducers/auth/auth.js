import { authConstants } from "../../actions/actionTypes";
import {
    signupStatus,
    signinStatus,
    signoutStatus,
    getMeStatus,
    notiStatus,
    getSubscriptionsStatus,
    getRecommendationsStatus,
    getKeywordsInitStatus,
    makeTasteInitStatus,
} from "../../../constants/constants";

const initialState = {
    signupStatus: signupStatus.NONE,
    signinStatus: signinStatus.NONE,
    signoutStatus: signoutStatus.NONE,
    getMeStatus: getMeStatus.NONE,
    getNotiStatus: notiStatus.NONE,
    readNotiStatus: notiStatus.NONE,
    subscriptions: {
        status: getSubscriptionsStatus.NONE,
        pageNum: 0,
        finished: true,
        list: [],
    },
    recommendations: {
        status: getRecommendationsStatus.NONE,
        list: [],
        pageNum: 0,
        finished: true,
    },
    keywords: {
        status: getKeywordsInitStatus.NONE,
        list: [],
        pageNum: 0,
        finished: true,
    },
    makeTasteInitStatus: makeTasteInitStatus.NONE,
    notifications: [],
    me: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case authConstants.SIGNUP_SUCCESS:
        return { ...state, signupStatus: signupStatus.SUCCESS };
    case authConstants.SIGNUP_FAILURE_DUPLICATE_USERNAME:
        return { ...state, signupStatus: signupStatus.DUPLICATE_USERNAME };
    case authConstants.SIGNUP_FAILURE_DUPLICATE_EMAIL:
        return { ...state, signupStatus: signupStatus.DUPLICATE_EMAIL };

    case authConstants.SIGNIN_SUCCESS:
        return { ...state, signinStatus: signinStatus.SUCCESS, me: action.target };
    case authConstants.SIGNIN_FAILURE_USER_NOT_EXIST:
        return { ...state, signinStatus: signinStatus.USER_NOT_EXIST };
    case authConstants.SIGNIN_FAILURE_WRONG_PW:
        return { ...state, signinStatus: signinStatus.WRONG_PW };

    case authConstants.SIGNOUT_SUCCESS:
        return { ...state, signoutStatus: signoutStatus.SUCCESS };
    case authConstants.SIGNOUT_FAILURE:
        return { ...state, signoutStatus: signoutStatus.FAILURE };

    case authConstants.GETME_SUCCESS:
        return { ...state, getMeStatus: getMeStatus.SUCCESS, me: action.target };
    case authConstants.GETME_FAILURE:
        return { ...state, getMeStatus: getMeStatus.FAILURE };

    case authConstants.GET_NOTI_SUCCESS:
        return { ...state, getNotiStatus: notiStatus.SUCCESS, notifications: action.target };
    case authConstants.GET_NOTI_FAILURE:
        return { ...state, getNotiStatus: notiStatus.FAILURE };

    case authConstants.READ_NOTI_SUCCESS:
        return { ...state, readNotiStatus: notiStatus.SUCCESS };
    case authConstants.READ_NOTI_FAILURE:
        return { ...state, readNotiStatus: notiStatus.FAILURE };

    case authConstants.GET_SUBSCRIPTION_SUCCESS:
        return {
            ...state,
            subscriptions: {
                status: getSubscriptionsStatus.SUCCESS,
                list: action.target.subscriptions,
                pageNum: action.target.page_number,
                finished: action.target.is_finished,
            },
        };
    case authConstants.GET_SUBSCRIPTION_FAILURE:
        return {
            ...state,
            subscriptions: {
                status: getSubscriptionsStatus.FAILURE,
                list: [],
                pageNum: 0,
                finished: true,
            },
        };

    case authConstants.GET_RECOMMENDATION_SUCCESS:
        return {
            ...state,
            recommendations: {
                status: getRecommendationsStatus.SUCCESS,
                list: action.target.recommendations,
                pageNum: action.target.page_number,
                finished: action.target.is_finished,
            },
        };
    case authConstants.GET_RECOMMENDATION_FAILURE:
        return {
            ...state,
            recommendations: {
                status: getRecommendationsStatus.FAILURE,
                list: [],
                pageNum: 0,
                finished: true,
            },
        };

    case authConstants.GET_KEYWORD_INIT_SUCCESS:
        return {
            ...state,
            keywords: {
                status: getKeywordsInitStatus.SUCCESS,
                list: action.target.keywords,
                pageNum: action.target.page_number,
                finished: action.target.is_finished,
            },
        };
    case authConstants.GET_KEYWORD_INIT_FAILURE:
        return {
            ...state,
            keywords: {
                status: getKeywordsInitStatus.FAILURE,
                list: [],
                pageNum: 0,
                finished: true,
            },
        };

    case authConstants.MAKE_TASTE_INIT_SUCCESS:
        return { ...state, makeTasteInitStatus: makeTasteInitStatus.SUCCESS };
    case authConstants.MAKE_TASTE_INIT_FAILURE:
        return { ...state, makeTasteInitStatus: makeTasteInitStatus.FAILURE };

    default:
        return { ...state };
    }
};
export default reducer;

import {SET_SPORT, SET_FIXTURE, SET_FIXTURES, SET_SPORTS, SET_CATEGORIES, SET_TOURNAMENTS, SET_ACTIVE_PERIOD} from '../types'


export const setSports = payload => {
    return {
        type: SET_SPORTS,
        payload,
    };
};

export const setSport = payload => {
    return {
        type: SET_SPORT,
        payload,
    };
};

export const setActivePeriod = payload => {
    return {
        type: SET_ACTIVE_PERIOD,
        payload,
    };
};

export const setCategories = payload => {
    return {
        type: SET_CATEGORIES,
        payload,
    };
};

export const setTournaments = payload => {
    return {
        type: SET_TOURNAMENTS,
        payload,
    };
};

export const setFixtures = payload => {
    return {
        type: SET_FIXTURES,
        payload,
    };
};

export const setFixture = payload => {
    return {
        type: SET_FIXTURE,
        payload,
    };
};

import moment from "moment";
import * as _ from 'lodash';
import { unslugify } from "unslugify";
import * as CryptoJS from "crypto-js";

export const toggleMenu = () => {
    const body = document.getElementsByTagName('body')[0];
    const app = document.getElementsByClassName('app')[0];
    body.classList.toggle('pml-open');
    app.classList.toggle('pml-open');
}

export const generateSignature = () => {
    // const md5Hash = CryptoJS.MD5('fwhchq' + process.env.REACT_APP_SITE_URL);
    const md5Hash = CryptoJS.MD5('pLA7Pydy5S5jFs1Oqxk8' + process.env.REACT_APP_SITE_URL);
    return md5Hash.toString().toUpperCase();
}

export const toggleAccordion = (e, id) => {
    let ele = e.target;

    if (id) {
        ele = document.getElementById(id);
    }
    /* Toggle between hiding and showing the active panel */
    const parent = ele.parentElement;
    parent.classList.toggle("open");
    // get the next element which is accordion content
    const content = ele.nextElementSibling
    content.classList.toggle('open')

}

export const getSpread = (eventMarkets, market) => {
    let specialValue = 0;
    if (eventMarkets.length) {
        _.each(eventMarkets, function (value, key) {
            if (value.TypeId === market.id) {
                specialValue = value.SpecialValue;
            }
        });
    }

    return specialValue;
}

export const slugify = (text) => {
    if(!text)
        return false;

    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export const unSlugify = (text) =>
    _.capitalize(unslugify(text))

export const groupFixtures = (data) => {
    let ArrKeyHolder = [];
    let Arr = [];
    data.forEach(function(item){
        ArrKeyHolder[item.event_date] = ArrKeyHolder[item.event_date]||{};
        let obj = ArrKeyHolder[item.event_date];

        if(Object.keys(obj).length === 0)
            Arr.push(obj);

        obj.event_date = item.event_date;
        obj.events  = obj.events || [];

        obj.events.push(item);
    });
    return Arr;
}

export const groupLiveFixtures = (data) => {
    let ArrKeyHolder = [];
    let Arr = [];
    data.forEach(function(item){
        ArrKeyHolder[item.sportId] = ArrKeyHolder[item.sportId]||{};
        let obj = ArrKeyHolder[item.sportId];

        if(Object.keys(obj).length === 0)
            Arr.push(obj);

        obj.sportName   = item.sportName;
        obj.sportId     = item.sportId;
        obj.tournaments = obj.tournaments || [];

        let foundIndex = obj.tournaments.findIndex(el => el.tournamentName === item.categoryName);

        if (foundIndex !== -1) {
            obj.tournaments[foundIndex].events.push(item);
        } else {
            obj.tournaments.push({
                tournamentName: item.categoryName,
                tournamentId: item.categoryId,
                categoryName: item.parentName,
                categoryId: item.parentId,
                events: [item],
            });
        }

        obj.markets     = obj.markets || [];
        if (item.games) {
            item.games.forEach((value, key) => {
                let found = obj.markets.some(el => el.gameName  === value.gameName);
                if (!found)
                    obj.markets.push(value);
            });
        }
        obj.markets.sort((a, b) => a.sortOrder - b.sortOrder);
    });
    Arr.sort((a, b) => a.sportId - b.sportId);
    return Arr;
}

export const groupBy = (data, field) => {
    let self = this;
    return data.reduce(function(rv, x) {
        (rv[x[field]] = rv[x[field]] || []).push(x);
        return rv;
    }, {});
}

export const formatDate = (str, format = 'YYYY-MM-DD HH:mm') =>
    moment(str).format(format);

export const goBack = (history) => {
    history.goBack();
}

export const isSelected = (ele_id, coupon) => {

    let isExist = false;

    if(coupon.selections.length > 0) {
        let count = coupon.selections.find((selection) => selection.element_id === ele_id);
        if (count) {
            isExist = true
        }
    }
    return isExist;
}

export const formatNumber = (number) =>
    !number ? 0 : parseFloat(number).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2});


export const toggleAccountMenu = (e) => {
    document.getElementById('project').classList.toggle('app--scroll-disabled');
    document.getElementsByClassName('account')[0].classList.toggle('open');
    document.getElementsByClassName('myacc-s__wrap')[0].classList.toggle('open');
    document.getElementsByClassName('myacc-s-mask')[0].classList.toggle('myacc-s-mask--active');
    const ele = document.getElementById('account-icon');

    if (ele.classList.contains('icon-account')) {
        ele.classList.remove('icon-account');
        ele.classList.add('icon-close');
    } else {
        ele.classList.remove('icon-close');
        ele.classList.add('icon-account');
    }
}

export const sortTeams = (teams) => {
    return teams.slice().sort((a, b) => a.ItemOrder - b.ItemOrder);
}

export const formatOdd = (odd) => {
    if (odd > 0 && odd % 1 === 0) {
        return odd + ".00";
    } else {
        return odd;
    }
}

export const formattedPhoneNumber = (phoneNumber) => {
    const pNumber = phoneNumber.toString();
    const first = pNumber.charAt(0);
    if (first === '0') {
        return pNumber.substring(1);
    }
    return pNumber;
}

export const formatTipsterName = name => {
    if (name) {
        const first3 = name.substring(0, 3);
        const last2 = name.substring(7);
        return first3 + '****' + last2;
    }
    return '';
}

export const formatBetslipId = id => {
    if (id) {
        const splitText = id.split('-');
        return '**********-' + splitText[1];
    }
}

export const calculateExclusionPeriod = (date) => {
    return moment(date).diff(moment(), 'days');
}

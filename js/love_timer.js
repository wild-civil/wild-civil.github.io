

eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return c.toString(a)
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function (e) {
            return r[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1
    }
    ;
    while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('a.f(\' %c 9 1 %c b://d.e/8/1\',\'2:#3;4:#5;6:7 0\',\'2:#5;4:#3;6:7\');', 16, 16, '|lanstar|color|444|background|eee|padding|5px|dyedd|Theme|console|https||github|com|log'.split('|'), 0, {}));
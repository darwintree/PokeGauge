import type { PokemonLite, UpstreamResourceId } from "../types"

/** Minimal per-Pokemon fields needed by synchronous first-screen paths.
 * Kept separate from GENERATED_POKEMON so the full dataset can stay in a
 * dynamically-imported chunk (see access.ts). */

export const GENERATED_POKEMON_LITE = {
  "1": {
    "speciesId": 1,
    "evioliteEligible": true
  },
  "2": {
    "speciesId": 2,
    "evioliteEligible": true
  },
  "3": {
    "speciesId": 3,
    "evioliteEligible": false
  },
  "4": {
    "speciesId": 4,
    "evioliteEligible": true
  },
  "5": {
    "speciesId": 5,
    "evioliteEligible": true
  },
  "6": {
    "speciesId": 6,
    "evioliteEligible": false
  },
  "7": {
    "speciesId": 7,
    "evioliteEligible": true
  },
  "8": {
    "speciesId": 8,
    "evioliteEligible": true
  },
  "9": {
    "speciesId": 9,
    "evioliteEligible": false
  },
  "10": {
    "speciesId": 10,
    "evioliteEligible": true
  },
  "11": {
    "speciesId": 11,
    "evioliteEligible": true
  },
  "12": {
    "speciesId": 12,
    "evioliteEligible": false
  },
  "13": {
    "speciesId": 13,
    "evioliteEligible": true
  },
  "14": {
    "speciesId": 14,
    "evioliteEligible": true
  },
  "15": {
    "speciesId": 15,
    "evioliteEligible": false
  },
  "16": {
    "speciesId": 16,
    "evioliteEligible": true
  },
  "17": {
    "speciesId": 17,
    "evioliteEligible": true
  },
  "18": {
    "speciesId": 18,
    "evioliteEligible": false
  },
  "19": {
    "speciesId": 19,
    "evioliteEligible": true
  },
  "20": {
    "speciesId": 20,
    "evioliteEligible": false
  },
  "21": {
    "speciesId": 21,
    "evioliteEligible": true
  },
  "22": {
    "speciesId": 22,
    "evioliteEligible": false
  },
  "23": {
    "speciesId": 23,
    "evioliteEligible": true
  },
  "24": {
    "speciesId": 24,
    "evioliteEligible": false
  },
  "25": {
    "speciesId": 25,
    "evioliteEligible": true
  },
  "26": {
    "speciesId": 26,
    "evioliteEligible": false
  },
  "27": {
    "speciesId": 27,
    "evioliteEligible": true
  },
  "28": {
    "speciesId": 28,
    "evioliteEligible": false
  },
  "29": {
    "speciesId": 29,
    "evioliteEligible": true
  },
  "30": {
    "speciesId": 30,
    "evioliteEligible": true
  },
  "31": {
    "speciesId": 31,
    "evioliteEligible": false
  },
  "32": {
    "speciesId": 32,
    "evioliteEligible": true
  },
  "33": {
    "speciesId": 33,
    "evioliteEligible": true
  },
  "34": {
    "speciesId": 34,
    "evioliteEligible": false
  },
  "35": {
    "speciesId": 35,
    "evioliteEligible": true
  },
  "36": {
    "speciesId": 36,
    "evioliteEligible": false
  },
  "37": {
    "speciesId": 37,
    "evioliteEligible": true
  },
  "38": {
    "speciesId": 38,
    "evioliteEligible": false
  },
  "39": {
    "speciesId": 39,
    "evioliteEligible": true
  },
  "40": {
    "speciesId": 40,
    "evioliteEligible": false
  },
  "41": {
    "speciesId": 41,
    "evioliteEligible": true
  },
  "42": {
    "speciesId": 42,
    "evioliteEligible": true
  },
  "43": {
    "speciesId": 43,
    "evioliteEligible": true
  },
  "44": {
    "speciesId": 44,
    "evioliteEligible": true
  },
  "45": {
    "speciesId": 45,
    "evioliteEligible": false
  },
  "46": {
    "speciesId": 46,
    "evioliteEligible": true
  },
  "47": {
    "speciesId": 47,
    "evioliteEligible": false
  },
  "48": {
    "speciesId": 48,
    "evioliteEligible": true
  },
  "49": {
    "speciesId": 49,
    "evioliteEligible": false
  },
  "50": {
    "speciesId": 50,
    "evioliteEligible": true
  },
  "51": {
    "speciesId": 51,
    "evioliteEligible": false
  },
  "52": {
    "speciesId": 52,
    "evioliteEligible": true
  },
  "53": {
    "speciesId": 53,
    "evioliteEligible": false
  },
  "54": {
    "speciesId": 54,
    "evioliteEligible": true
  },
  "55": {
    "speciesId": 55,
    "evioliteEligible": false
  },
  "56": {
    "speciesId": 56,
    "evioliteEligible": true
  },
  "57": {
    "speciesId": 57,
    "evioliteEligible": true
  },
  "58": {
    "speciesId": 58,
    "evioliteEligible": true
  },
  "59": {
    "speciesId": 59,
    "evioliteEligible": false
  },
  "60": {
    "speciesId": 60,
    "evioliteEligible": true
  },
  "61": {
    "speciesId": 61,
    "evioliteEligible": true
  },
  "62": {
    "speciesId": 62,
    "evioliteEligible": false
  },
  "63": {
    "speciesId": 63,
    "evioliteEligible": true
  },
  "64": {
    "speciesId": 64,
    "evioliteEligible": true
  },
  "65": {
    "speciesId": 65,
    "evioliteEligible": false
  },
  "66": {
    "speciesId": 66,
    "evioliteEligible": true
  },
  "67": {
    "speciesId": 67,
    "evioliteEligible": true
  },
  "68": {
    "speciesId": 68,
    "evioliteEligible": false
  },
  "69": {
    "speciesId": 69,
    "evioliteEligible": true
  },
  "70": {
    "speciesId": 70,
    "evioliteEligible": true
  },
  "71": {
    "speciesId": 71,
    "evioliteEligible": false
  },
  "72": {
    "speciesId": 72,
    "evioliteEligible": true
  },
  "73": {
    "speciesId": 73,
    "evioliteEligible": false
  },
  "74": {
    "speciesId": 74,
    "evioliteEligible": true
  },
  "75": {
    "speciesId": 75,
    "evioliteEligible": true
  },
  "76": {
    "speciesId": 76,
    "evioliteEligible": false
  },
  "77": {
    "speciesId": 77,
    "evioliteEligible": true
  },
  "78": {
    "speciesId": 78,
    "evioliteEligible": false
  },
  "79": {
    "speciesId": 79,
    "evioliteEligible": true
  },
  "80": {
    "speciesId": 80,
    "evioliteEligible": false
  },
  "81": {
    "speciesId": 81,
    "evioliteEligible": true
  },
  "82": {
    "speciesId": 82,
    "evioliteEligible": true
  },
  "83": {
    "speciesId": 83,
    "evioliteEligible": false
  },
  "84": {
    "speciesId": 84,
    "evioliteEligible": true
  },
  "85": {
    "speciesId": 85,
    "evioliteEligible": false
  },
  "86": {
    "speciesId": 86,
    "evioliteEligible": true
  },
  "87": {
    "speciesId": 87,
    "evioliteEligible": false
  },
  "88": {
    "speciesId": 88,
    "evioliteEligible": true
  },
  "89": {
    "speciesId": 89,
    "evioliteEligible": false
  },
  "90": {
    "speciesId": 90,
    "evioliteEligible": true
  },
  "91": {
    "speciesId": 91,
    "evioliteEligible": false
  },
  "92": {
    "speciesId": 92,
    "evioliteEligible": true
  },
  "93": {
    "speciesId": 93,
    "evioliteEligible": true
  },
  "94": {
    "speciesId": 94,
    "evioliteEligible": false
  },
  "95": {
    "speciesId": 95,
    "evioliteEligible": true
  },
  "96": {
    "speciesId": 96,
    "evioliteEligible": true
  },
  "97": {
    "speciesId": 97,
    "evioliteEligible": false
  },
  "98": {
    "speciesId": 98,
    "evioliteEligible": true
  },
  "99": {
    "speciesId": 99,
    "evioliteEligible": false
  },
  "100": {
    "speciesId": 100,
    "evioliteEligible": true
  },
  "101": {
    "speciesId": 101,
    "evioliteEligible": false
  },
  "102": {
    "speciesId": 102,
    "evioliteEligible": true
  },
  "103": {
    "speciesId": 103,
    "evioliteEligible": false
  },
  "104": {
    "speciesId": 104,
    "evioliteEligible": true
  },
  "105": {
    "speciesId": 105,
    "evioliteEligible": false
  },
  "106": {
    "speciesId": 106,
    "evioliteEligible": false
  },
  "107": {
    "speciesId": 107,
    "evioliteEligible": false
  },
  "108": {
    "speciesId": 108,
    "evioliteEligible": true
  },
  "109": {
    "speciesId": 109,
    "evioliteEligible": true
  },
  "110": {
    "speciesId": 110,
    "evioliteEligible": false
  },
  "111": {
    "speciesId": 111,
    "evioliteEligible": true
  },
  "112": {
    "speciesId": 112,
    "evioliteEligible": true
  },
  "113": {
    "speciesId": 113,
    "evioliteEligible": true
  },
  "114": {
    "speciesId": 114,
    "evioliteEligible": true
  },
  "115": {
    "speciesId": 115,
    "evioliteEligible": false
  },
  "116": {
    "speciesId": 116,
    "evioliteEligible": true
  },
  "117": {
    "speciesId": 117,
    "evioliteEligible": true
  },
  "118": {
    "speciesId": 118,
    "evioliteEligible": true
  },
  "119": {
    "speciesId": 119,
    "evioliteEligible": false
  },
  "120": {
    "speciesId": 120,
    "evioliteEligible": true
  },
  "121": {
    "speciesId": 121,
    "evioliteEligible": false
  },
  "122": {
    "speciesId": 122,
    "evioliteEligible": false
  },
  "123": {
    "speciesId": 123,
    "evioliteEligible": true
  },
  "124": {
    "speciesId": 124,
    "evioliteEligible": false
  },
  "125": {
    "speciesId": 125,
    "evioliteEligible": true
  },
  "126": {
    "speciesId": 126,
    "evioliteEligible": true
  },
  "127": {
    "speciesId": 127,
    "evioliteEligible": false
  },
  "128": {
    "speciesId": 128,
    "evioliteEligible": false
  },
  "129": {
    "speciesId": 129,
    "evioliteEligible": true
  },
  "130": {
    "speciesId": 130,
    "evioliteEligible": false
  },
  "131": {
    "speciesId": 131,
    "evioliteEligible": false
  },
  "132": {
    "speciesId": 132,
    "evioliteEligible": false
  },
  "133": {
    "speciesId": 133,
    "evioliteEligible": true
  },
  "134": {
    "speciesId": 134,
    "evioliteEligible": false
  },
  "135": {
    "speciesId": 135,
    "evioliteEligible": false
  },
  "136": {
    "speciesId": 136,
    "evioliteEligible": false
  },
  "137": {
    "speciesId": 137,
    "evioliteEligible": true
  },
  "138": {
    "speciesId": 138,
    "evioliteEligible": true
  },
  "139": {
    "speciesId": 139,
    "evioliteEligible": false
  },
  "140": {
    "speciesId": 140,
    "evioliteEligible": true
  },
  "141": {
    "speciesId": 141,
    "evioliteEligible": false
  },
  "142": {
    "speciesId": 142,
    "evioliteEligible": false
  },
  "143": {
    "speciesId": 143,
    "evioliteEligible": false
  },
  "144": {
    "speciesId": 144,
    "evioliteEligible": false
  },
  "145": {
    "speciesId": 145,
    "evioliteEligible": false
  },
  "146": {
    "speciesId": 146,
    "evioliteEligible": false
  },
  "147": {
    "speciesId": 147,
    "evioliteEligible": true
  },
  "148": {
    "speciesId": 148,
    "evioliteEligible": true
  },
  "149": {
    "speciesId": 149,
    "evioliteEligible": false
  },
  "150": {
    "speciesId": 150,
    "evioliteEligible": false
  },
  "151": {
    "speciesId": 151,
    "evioliteEligible": false
  },
  "152": {
    "speciesId": 152,
    "evioliteEligible": true
  },
  "153": {
    "speciesId": 153,
    "evioliteEligible": true
  },
  "154": {
    "speciesId": 154,
    "evioliteEligible": false
  },
  "155": {
    "speciesId": 155,
    "evioliteEligible": true
  },
  "156": {
    "speciesId": 156,
    "evioliteEligible": true
  },
  "157": {
    "speciesId": 157,
    "evioliteEligible": false
  },
  "158": {
    "speciesId": 158,
    "evioliteEligible": true
  },
  "159": {
    "speciesId": 159,
    "evioliteEligible": true
  },
  "160": {
    "speciesId": 160,
    "evioliteEligible": false
  },
  "161": {
    "speciesId": 161,
    "evioliteEligible": true
  },
  "162": {
    "speciesId": 162,
    "evioliteEligible": false
  },
  "163": {
    "speciesId": 163,
    "evioliteEligible": true
  },
  "164": {
    "speciesId": 164,
    "evioliteEligible": false
  },
  "165": {
    "speciesId": 165,
    "evioliteEligible": true
  },
  "166": {
    "speciesId": 166,
    "evioliteEligible": false
  },
  "167": {
    "speciesId": 167,
    "evioliteEligible": true
  },
  "168": {
    "speciesId": 168,
    "evioliteEligible": false
  },
  "169": {
    "speciesId": 169,
    "evioliteEligible": false
  },
  "170": {
    "speciesId": 170,
    "evioliteEligible": true
  },
  "171": {
    "speciesId": 171,
    "evioliteEligible": false
  },
  "172": {
    "speciesId": 172,
    "evioliteEligible": true
  },
  "173": {
    "speciesId": 173,
    "evioliteEligible": true
  },
  "174": {
    "speciesId": 174,
    "evioliteEligible": true
  },
  "175": {
    "speciesId": 175,
    "evioliteEligible": true
  },
  "176": {
    "speciesId": 176,
    "evioliteEligible": true
  },
  "177": {
    "speciesId": 177,
    "evioliteEligible": true
  },
  "178": {
    "speciesId": 178,
    "evioliteEligible": false
  },
  "179": {
    "speciesId": 179,
    "evioliteEligible": true
  },
  "180": {
    "speciesId": 180,
    "evioliteEligible": true
  },
  "181": {
    "speciesId": 181,
    "evioliteEligible": false
  },
  "182": {
    "speciesId": 182,
    "evioliteEligible": false
  },
  "183": {
    "speciesId": 183,
    "evioliteEligible": true
  },
  "184": {
    "speciesId": 184,
    "evioliteEligible": false
  },
  "185": {
    "speciesId": 185,
    "evioliteEligible": false
  },
  "186": {
    "speciesId": 186,
    "evioliteEligible": false
  },
  "187": {
    "speciesId": 187,
    "evioliteEligible": true
  },
  "188": {
    "speciesId": 188,
    "evioliteEligible": true
  },
  "189": {
    "speciesId": 189,
    "evioliteEligible": false
  },
  "190": {
    "speciesId": 190,
    "evioliteEligible": true
  },
  "191": {
    "speciesId": 191,
    "evioliteEligible": true
  },
  "192": {
    "speciesId": 192,
    "evioliteEligible": false
  },
  "193": {
    "speciesId": 193,
    "evioliteEligible": true
  },
  "194": {
    "speciesId": 194,
    "evioliteEligible": true
  },
  "195": {
    "speciesId": 195,
    "evioliteEligible": false
  },
  "196": {
    "speciesId": 196,
    "evioliteEligible": false
  },
  "197": {
    "speciesId": 197,
    "evioliteEligible": false
  },
  "198": {
    "speciesId": 198,
    "evioliteEligible": true
  },
  "199": {
    "speciesId": 199,
    "evioliteEligible": false
  },
  "200": {
    "speciesId": 200,
    "evioliteEligible": true
  },
  "201": {
    "speciesId": 201,
    "evioliteEligible": false
  },
  "202": {
    "speciesId": 202,
    "evioliteEligible": false
  },
  "203": {
    "speciesId": 203,
    "evioliteEligible": true
  },
  "204": {
    "speciesId": 204,
    "evioliteEligible": true
  },
  "205": {
    "speciesId": 205,
    "evioliteEligible": false
  },
  "206": {
    "speciesId": 206,
    "evioliteEligible": true
  },
  "207": {
    "speciesId": 207,
    "evioliteEligible": true
  },
  "208": {
    "speciesId": 208,
    "evioliteEligible": false
  },
  "209": {
    "speciesId": 209,
    "evioliteEligible": true
  },
  "210": {
    "speciesId": 210,
    "evioliteEligible": false
  },
  "211": {
    "speciesId": 211,
    "evioliteEligible": false
  },
  "212": {
    "speciesId": 212,
    "evioliteEligible": false
  },
  "213": {
    "speciesId": 213,
    "evioliteEligible": false
  },
  "214": {
    "speciesId": 214,
    "evioliteEligible": false
  },
  "215": {
    "speciesId": 215,
    "evioliteEligible": true
  },
  "216": {
    "speciesId": 216,
    "evioliteEligible": true
  },
  "217": {
    "speciesId": 217,
    "evioliteEligible": true
  },
  "218": {
    "speciesId": 218,
    "evioliteEligible": true
  },
  "219": {
    "speciesId": 219,
    "evioliteEligible": false
  },
  "220": {
    "speciesId": 220,
    "evioliteEligible": true
  },
  "221": {
    "speciesId": 221,
    "evioliteEligible": true
  },
  "222": {
    "speciesId": 222,
    "evioliteEligible": false
  },
  "223": {
    "speciesId": 223,
    "evioliteEligible": true
  },
  "224": {
    "speciesId": 224,
    "evioliteEligible": false
  },
  "225": {
    "speciesId": 225,
    "evioliteEligible": false
  },
  "226": {
    "speciesId": 226,
    "evioliteEligible": false
  },
  "227": {
    "speciesId": 227,
    "evioliteEligible": false
  },
  "228": {
    "speciesId": 228,
    "evioliteEligible": true
  },
  "229": {
    "speciesId": 229,
    "evioliteEligible": false
  },
  "230": {
    "speciesId": 230,
    "evioliteEligible": false
  },
  "231": {
    "speciesId": 231,
    "evioliteEligible": true
  },
  "232": {
    "speciesId": 232,
    "evioliteEligible": false
  },
  "233": {
    "speciesId": 233,
    "evioliteEligible": true
  },
  "234": {
    "speciesId": 234,
    "evioliteEligible": true
  },
  "235": {
    "speciesId": 235,
    "evioliteEligible": false
  },
  "236": {
    "speciesId": 236,
    "evioliteEligible": true
  },
  "237": {
    "speciesId": 237,
    "evioliteEligible": false
  },
  "238": {
    "speciesId": 238,
    "evioliteEligible": true
  },
  "239": {
    "speciesId": 239,
    "evioliteEligible": true
  },
  "240": {
    "speciesId": 240,
    "evioliteEligible": true
  },
  "241": {
    "speciesId": 241,
    "evioliteEligible": false
  },
  "242": {
    "speciesId": 242,
    "evioliteEligible": false
  },
  "243": {
    "speciesId": 243,
    "evioliteEligible": false
  },
  "244": {
    "speciesId": 244,
    "evioliteEligible": false
  },
  "245": {
    "speciesId": 245,
    "evioliteEligible": false
  },
  "246": {
    "speciesId": 246,
    "evioliteEligible": true
  },
  "247": {
    "speciesId": 247,
    "evioliteEligible": true
  },
  "248": {
    "speciesId": 248,
    "evioliteEligible": false
  },
  "249": {
    "speciesId": 249,
    "evioliteEligible": false
  },
  "250": {
    "speciesId": 250,
    "evioliteEligible": false
  },
  "251": {
    "speciesId": 251,
    "evioliteEligible": false
  },
  "252": {
    "speciesId": 252,
    "evioliteEligible": true
  },
  "253": {
    "speciesId": 253,
    "evioliteEligible": true
  },
  "254": {
    "speciesId": 254,
    "evioliteEligible": false
  },
  "255": {
    "speciesId": 255,
    "evioliteEligible": true
  },
  "256": {
    "speciesId": 256,
    "evioliteEligible": true
  },
  "257": {
    "speciesId": 257,
    "evioliteEligible": false
  },
  "258": {
    "speciesId": 258,
    "evioliteEligible": true
  },
  "259": {
    "speciesId": 259,
    "evioliteEligible": true
  },
  "260": {
    "speciesId": 260,
    "evioliteEligible": false
  },
  "261": {
    "speciesId": 261,
    "evioliteEligible": true
  },
  "262": {
    "speciesId": 262,
    "evioliteEligible": false
  },
  "263": {
    "speciesId": 263,
    "evioliteEligible": true
  },
  "264": {
    "speciesId": 264,
    "evioliteEligible": false
  },
  "265": {
    "speciesId": 265,
    "evioliteEligible": true
  },
  "266": {
    "speciesId": 266,
    "evioliteEligible": true
  },
  "267": {
    "speciesId": 267,
    "evioliteEligible": false
  },
  "268": {
    "speciesId": 268,
    "evioliteEligible": true
  },
  "269": {
    "speciesId": 269,
    "evioliteEligible": false
  },
  "270": {
    "speciesId": 270,
    "evioliteEligible": true
  },
  "271": {
    "speciesId": 271,
    "evioliteEligible": true
  },
  "272": {
    "speciesId": 272,
    "evioliteEligible": false
  },
  "273": {
    "speciesId": 273,
    "evioliteEligible": true
  },
  "274": {
    "speciesId": 274,
    "evioliteEligible": true
  },
  "275": {
    "speciesId": 275,
    "evioliteEligible": false
  },
  "276": {
    "speciesId": 276,
    "evioliteEligible": true
  },
  "277": {
    "speciesId": 277,
    "evioliteEligible": false
  },
  "278": {
    "speciesId": 278,
    "evioliteEligible": true
  },
  "279": {
    "speciesId": 279,
    "evioliteEligible": false
  },
  "280": {
    "speciesId": 280,
    "evioliteEligible": true
  },
  "281": {
    "speciesId": 281,
    "evioliteEligible": true
  },
  "282": {
    "speciesId": 282,
    "evioliteEligible": false
  },
  "283": {
    "speciesId": 283,
    "evioliteEligible": true
  },
  "284": {
    "speciesId": 284,
    "evioliteEligible": false
  },
  "285": {
    "speciesId": 285,
    "evioliteEligible": true
  },
  "286": {
    "speciesId": 286,
    "evioliteEligible": false
  },
  "287": {
    "speciesId": 287,
    "evioliteEligible": true
  },
  "288": {
    "speciesId": 288,
    "evioliteEligible": true
  },
  "289": {
    "speciesId": 289,
    "evioliteEligible": false
  },
  "290": {
    "speciesId": 290,
    "evioliteEligible": true
  },
  "291": {
    "speciesId": 291,
    "evioliteEligible": false
  },
  "292": {
    "speciesId": 292,
    "evioliteEligible": false
  },
  "293": {
    "speciesId": 293,
    "evioliteEligible": true
  },
  "294": {
    "speciesId": 294,
    "evioliteEligible": true
  },
  "295": {
    "speciesId": 295,
    "evioliteEligible": false
  },
  "296": {
    "speciesId": 296,
    "evioliteEligible": true
  },
  "297": {
    "speciesId": 297,
    "evioliteEligible": false
  },
  "298": {
    "speciesId": 298,
    "evioliteEligible": true
  },
  "299": {
    "speciesId": 299,
    "evioliteEligible": true
  },
  "300": {
    "speciesId": 300,
    "evioliteEligible": true
  },
  "301": {
    "speciesId": 301,
    "evioliteEligible": false
  },
  "302": {
    "speciesId": 302,
    "evioliteEligible": false
  },
  "303": {
    "speciesId": 303,
    "evioliteEligible": false
  },
  "304": {
    "speciesId": 304,
    "evioliteEligible": true
  },
  "305": {
    "speciesId": 305,
    "evioliteEligible": true
  },
  "306": {
    "speciesId": 306,
    "evioliteEligible": false
  },
  "307": {
    "speciesId": 307,
    "evioliteEligible": true
  },
  "308": {
    "speciesId": 308,
    "evioliteEligible": false
  },
  "309": {
    "speciesId": 309,
    "evioliteEligible": true
  },
  "310": {
    "speciesId": 310,
    "evioliteEligible": false
  },
  "311": {
    "speciesId": 311,
    "evioliteEligible": false
  },
  "312": {
    "speciesId": 312,
    "evioliteEligible": false
  },
  "313": {
    "speciesId": 313,
    "evioliteEligible": false
  },
  "314": {
    "speciesId": 314,
    "evioliteEligible": false
  },
  "315": {
    "speciesId": 315,
    "evioliteEligible": true
  },
  "316": {
    "speciesId": 316,
    "evioliteEligible": true
  },
  "317": {
    "speciesId": 317,
    "evioliteEligible": false
  },
  "318": {
    "speciesId": 318,
    "evioliteEligible": true
  },
  "319": {
    "speciesId": 319,
    "evioliteEligible": false
  },
  "320": {
    "speciesId": 320,
    "evioliteEligible": true
  },
  "321": {
    "speciesId": 321,
    "evioliteEligible": false
  },
  "322": {
    "speciesId": 322,
    "evioliteEligible": true
  },
  "323": {
    "speciesId": 323,
    "evioliteEligible": false
  },
  "324": {
    "speciesId": 324,
    "evioliteEligible": false
  },
  "325": {
    "speciesId": 325,
    "evioliteEligible": true
  },
  "326": {
    "speciesId": 326,
    "evioliteEligible": false
  },
  "327": {
    "speciesId": 327,
    "evioliteEligible": false
  },
  "328": {
    "speciesId": 328,
    "evioliteEligible": true
  },
  "329": {
    "speciesId": 329,
    "evioliteEligible": true
  },
  "330": {
    "speciesId": 330,
    "evioliteEligible": false
  },
  "331": {
    "speciesId": 331,
    "evioliteEligible": true
  },
  "332": {
    "speciesId": 332,
    "evioliteEligible": false
  },
  "333": {
    "speciesId": 333,
    "evioliteEligible": true
  },
  "334": {
    "speciesId": 334,
    "evioliteEligible": false
  },
  "335": {
    "speciesId": 335,
    "evioliteEligible": false
  },
  "336": {
    "speciesId": 336,
    "evioliteEligible": false
  },
  "337": {
    "speciesId": 337,
    "evioliteEligible": false
  },
  "338": {
    "speciesId": 338,
    "evioliteEligible": false
  },
  "339": {
    "speciesId": 339,
    "evioliteEligible": true
  },
  "340": {
    "speciesId": 340,
    "evioliteEligible": false
  },
  "341": {
    "speciesId": 341,
    "evioliteEligible": true
  },
  "342": {
    "speciesId": 342,
    "evioliteEligible": false
  },
  "343": {
    "speciesId": 343,
    "evioliteEligible": true
  },
  "344": {
    "speciesId": 344,
    "evioliteEligible": false
  },
  "345": {
    "speciesId": 345,
    "evioliteEligible": true
  },
  "346": {
    "speciesId": 346,
    "evioliteEligible": false
  },
  "347": {
    "speciesId": 347,
    "evioliteEligible": true
  },
  "348": {
    "speciesId": 348,
    "evioliteEligible": false
  },
  "349": {
    "speciesId": 349,
    "evioliteEligible": true
  },
  "350": {
    "speciesId": 350,
    "evioliteEligible": false
  },
  "351": {
    "speciesId": 351,
    "evioliteEligible": false
  },
  "352": {
    "speciesId": 352,
    "evioliteEligible": false
  },
  "353": {
    "speciesId": 353,
    "evioliteEligible": true
  },
  "354": {
    "speciesId": 354,
    "evioliteEligible": false
  },
  "355": {
    "speciesId": 355,
    "evioliteEligible": true
  },
  "356": {
    "speciesId": 356,
    "evioliteEligible": true
  },
  "357": {
    "speciesId": 357,
    "evioliteEligible": false
  },
  "358": {
    "speciesId": 358,
    "evioliteEligible": false
  },
  "359": {
    "speciesId": 359,
    "evioliteEligible": false
  },
  "360": {
    "speciesId": 360,
    "evioliteEligible": true
  },
  "361": {
    "speciesId": 361,
    "evioliteEligible": true
  },
  "362": {
    "speciesId": 362,
    "evioliteEligible": false
  },
  "363": {
    "speciesId": 363,
    "evioliteEligible": true
  },
  "364": {
    "speciesId": 364,
    "evioliteEligible": true
  },
  "365": {
    "speciesId": 365,
    "evioliteEligible": false
  },
  "366": {
    "speciesId": 366,
    "evioliteEligible": true
  },
  "367": {
    "speciesId": 367,
    "evioliteEligible": false
  },
  "368": {
    "speciesId": 368,
    "evioliteEligible": false
  },
  "369": {
    "speciesId": 369,
    "evioliteEligible": false
  },
  "370": {
    "speciesId": 370,
    "evioliteEligible": false
  },
  "371": {
    "speciesId": 371,
    "evioliteEligible": true
  },
  "372": {
    "speciesId": 372,
    "evioliteEligible": true
  },
  "373": {
    "speciesId": 373,
    "evioliteEligible": false
  },
  "374": {
    "speciesId": 374,
    "evioliteEligible": true
  },
  "375": {
    "speciesId": 375,
    "evioliteEligible": true
  },
  "376": {
    "speciesId": 376,
    "evioliteEligible": false
  },
  "377": {
    "speciesId": 377,
    "evioliteEligible": false
  },
  "378": {
    "speciesId": 378,
    "evioliteEligible": false
  },
  "379": {
    "speciesId": 379,
    "evioliteEligible": false
  },
  "380": {
    "speciesId": 380,
    "evioliteEligible": false
  },
  "381": {
    "speciesId": 381,
    "evioliteEligible": false
  },
  "382": {
    "speciesId": 382,
    "evioliteEligible": false
  },
  "383": {
    "speciesId": 383,
    "evioliteEligible": false
  },
  "384": {
    "speciesId": 384,
    "evioliteEligible": false
  },
  "385": {
    "speciesId": 385,
    "evioliteEligible": false
  },
  "386": {
    "speciesId": 386,
    "evioliteEligible": false
  },
  "387": {
    "speciesId": 387,
    "evioliteEligible": true
  },
  "388": {
    "speciesId": 388,
    "evioliteEligible": true
  },
  "389": {
    "speciesId": 389,
    "evioliteEligible": false
  },
  "390": {
    "speciesId": 390,
    "evioliteEligible": true
  },
  "391": {
    "speciesId": 391,
    "evioliteEligible": true
  },
  "392": {
    "speciesId": 392,
    "evioliteEligible": false
  },
  "393": {
    "speciesId": 393,
    "evioliteEligible": true
  },
  "394": {
    "speciesId": 394,
    "evioliteEligible": true
  },
  "395": {
    "speciesId": 395,
    "evioliteEligible": false
  },
  "396": {
    "speciesId": 396,
    "evioliteEligible": true
  },
  "397": {
    "speciesId": 397,
    "evioliteEligible": true
  },
  "398": {
    "speciesId": 398,
    "evioliteEligible": false
  },
  "399": {
    "speciesId": 399,
    "evioliteEligible": true
  },
  "400": {
    "speciesId": 400,
    "evioliteEligible": false
  },
  "401": {
    "speciesId": 401,
    "evioliteEligible": true
  },
  "402": {
    "speciesId": 402,
    "evioliteEligible": false
  },
  "403": {
    "speciesId": 403,
    "evioliteEligible": true
  },
  "404": {
    "speciesId": 404,
    "evioliteEligible": true
  },
  "405": {
    "speciesId": 405,
    "evioliteEligible": false
  },
  "406": {
    "speciesId": 406,
    "evioliteEligible": true
  },
  "407": {
    "speciesId": 407,
    "evioliteEligible": false
  },
  "408": {
    "speciesId": 408,
    "evioliteEligible": true
  },
  "409": {
    "speciesId": 409,
    "evioliteEligible": false
  },
  "410": {
    "speciesId": 410,
    "evioliteEligible": true
  },
  "411": {
    "speciesId": 411,
    "evioliteEligible": false
  },
  "412": {
    "speciesId": 412,
    "evioliteEligible": true
  },
  "413": {
    "speciesId": 413,
    "evioliteEligible": false
  },
  "414": {
    "speciesId": 414,
    "evioliteEligible": false
  },
  "415": {
    "speciesId": 415,
    "evioliteEligible": true
  },
  "416": {
    "speciesId": 416,
    "evioliteEligible": false
  },
  "417": {
    "speciesId": 417,
    "evioliteEligible": false
  },
  "418": {
    "speciesId": 418,
    "evioliteEligible": true
  },
  "419": {
    "speciesId": 419,
    "evioliteEligible": false
  },
  "420": {
    "speciesId": 420,
    "evioliteEligible": true
  },
  "421": {
    "speciesId": 421,
    "evioliteEligible": false
  },
  "422": {
    "speciesId": 422,
    "evioliteEligible": true
  },
  "423": {
    "speciesId": 423,
    "evioliteEligible": false
  },
  "424": {
    "speciesId": 424,
    "evioliteEligible": false
  },
  "425": {
    "speciesId": 425,
    "evioliteEligible": true
  },
  "426": {
    "speciesId": 426,
    "evioliteEligible": false
  },
  "427": {
    "speciesId": 427,
    "evioliteEligible": true
  },
  "428": {
    "speciesId": 428,
    "evioliteEligible": false
  },
  "429": {
    "speciesId": 429,
    "evioliteEligible": false
  },
  "430": {
    "speciesId": 430,
    "evioliteEligible": false
  },
  "431": {
    "speciesId": 431,
    "evioliteEligible": true
  },
  "432": {
    "speciesId": 432,
    "evioliteEligible": false
  },
  "433": {
    "speciesId": 433,
    "evioliteEligible": true
  },
  "434": {
    "speciesId": 434,
    "evioliteEligible": true
  },
  "435": {
    "speciesId": 435,
    "evioliteEligible": false
  },
  "436": {
    "speciesId": 436,
    "evioliteEligible": true
  },
  "437": {
    "speciesId": 437,
    "evioliteEligible": false
  },
  "438": {
    "speciesId": 438,
    "evioliteEligible": true
  },
  "439": {
    "speciesId": 439,
    "evioliteEligible": true
  },
  "440": {
    "speciesId": 440,
    "evioliteEligible": true
  },
  "441": {
    "speciesId": 441,
    "evioliteEligible": false
  },
  "442": {
    "speciesId": 442,
    "evioliteEligible": false
  },
  "443": {
    "speciesId": 443,
    "evioliteEligible": true
  },
  "444": {
    "speciesId": 444,
    "evioliteEligible": true
  },
  "445": {
    "speciesId": 445,
    "evioliteEligible": false
  },
  "446": {
    "speciesId": 446,
    "evioliteEligible": true
  },
  "447": {
    "speciesId": 447,
    "evioliteEligible": true
  },
  "448": {
    "speciesId": 448,
    "evioliteEligible": false
  },
  "449": {
    "speciesId": 449,
    "evioliteEligible": true
  },
  "450": {
    "speciesId": 450,
    "evioliteEligible": false
  },
  "451": {
    "speciesId": 451,
    "evioliteEligible": true
  },
  "452": {
    "speciesId": 452,
    "evioliteEligible": false
  },
  "453": {
    "speciesId": 453,
    "evioliteEligible": true
  },
  "454": {
    "speciesId": 454,
    "evioliteEligible": false
  },
  "455": {
    "speciesId": 455,
    "evioliteEligible": false
  },
  "456": {
    "speciesId": 456,
    "evioliteEligible": true
  },
  "457": {
    "speciesId": 457,
    "evioliteEligible": false
  },
  "458": {
    "speciesId": 458,
    "evioliteEligible": true
  },
  "459": {
    "speciesId": 459,
    "evioliteEligible": true
  },
  "460": {
    "speciesId": 460,
    "evioliteEligible": false
  },
  "461": {
    "speciesId": 461,
    "evioliteEligible": false
  },
  "462": {
    "speciesId": 462,
    "evioliteEligible": false
  },
  "463": {
    "speciesId": 463,
    "evioliteEligible": false
  },
  "464": {
    "speciesId": 464,
    "evioliteEligible": false
  },
  "465": {
    "speciesId": 465,
    "evioliteEligible": false
  },
  "466": {
    "speciesId": 466,
    "evioliteEligible": false
  },
  "467": {
    "speciesId": 467,
    "evioliteEligible": false
  },
  "468": {
    "speciesId": 468,
    "evioliteEligible": false
  },
  "469": {
    "speciesId": 469,
    "evioliteEligible": false
  },
  "470": {
    "speciesId": 470,
    "evioliteEligible": false
  },
  "471": {
    "speciesId": 471,
    "evioliteEligible": false
  },
  "472": {
    "speciesId": 472,
    "evioliteEligible": false
  },
  "473": {
    "speciesId": 473,
    "evioliteEligible": false
  },
  "474": {
    "speciesId": 474,
    "evioliteEligible": false
  },
  "475": {
    "speciesId": 475,
    "evioliteEligible": false
  },
  "476": {
    "speciesId": 476,
    "evioliteEligible": false
  },
  "477": {
    "speciesId": 477,
    "evioliteEligible": false
  },
  "478": {
    "speciesId": 478,
    "evioliteEligible": false
  },
  "479": {
    "speciesId": 479,
    "evioliteEligible": false
  },
  "480": {
    "speciesId": 480,
    "evioliteEligible": false
  },
  "481": {
    "speciesId": 481,
    "evioliteEligible": false
  },
  "482": {
    "speciesId": 482,
    "evioliteEligible": false
  },
  "483": {
    "speciesId": 483,
    "evioliteEligible": false
  },
  "484": {
    "speciesId": 484,
    "evioliteEligible": false
  },
  "485": {
    "speciesId": 485,
    "evioliteEligible": false
  },
  "486": {
    "speciesId": 486,
    "evioliteEligible": false
  },
  "487": {
    "speciesId": 487,
    "evioliteEligible": false
  },
  "488": {
    "speciesId": 488,
    "evioliteEligible": false
  },
  "489": {
    "speciesId": 489,
    "evioliteEligible": false
  },
  "490": {
    "speciesId": 490,
    "evioliteEligible": false
  },
  "491": {
    "speciesId": 491,
    "evioliteEligible": false
  },
  "492": {
    "speciesId": 492,
    "evioliteEligible": false
  },
  "493": {
    "speciesId": 493,
    "evioliteEligible": false
  },
  "494": {
    "speciesId": 494,
    "evioliteEligible": false
  },
  "495": {
    "speciesId": 495,
    "evioliteEligible": true
  },
  "496": {
    "speciesId": 496,
    "evioliteEligible": true
  },
  "497": {
    "speciesId": 497,
    "evioliteEligible": false
  },
  "498": {
    "speciesId": 498,
    "evioliteEligible": true
  },
  "499": {
    "speciesId": 499,
    "evioliteEligible": true
  },
  "500": {
    "speciesId": 500,
    "evioliteEligible": false
  },
  "501": {
    "speciesId": 501,
    "evioliteEligible": true
  },
  "502": {
    "speciesId": 502,
    "evioliteEligible": true
  },
  "503": {
    "speciesId": 503,
    "evioliteEligible": false
  },
  "504": {
    "speciesId": 504,
    "evioliteEligible": true
  },
  "505": {
    "speciesId": 505,
    "evioliteEligible": false
  },
  "506": {
    "speciesId": 506,
    "evioliteEligible": true
  },
  "507": {
    "speciesId": 507,
    "evioliteEligible": true
  },
  "508": {
    "speciesId": 508,
    "evioliteEligible": false
  },
  "509": {
    "speciesId": 509,
    "evioliteEligible": true
  },
  "510": {
    "speciesId": 510,
    "evioliteEligible": false
  },
  "511": {
    "speciesId": 511,
    "evioliteEligible": true
  },
  "512": {
    "speciesId": 512,
    "evioliteEligible": false
  },
  "513": {
    "speciesId": 513,
    "evioliteEligible": true
  },
  "514": {
    "speciesId": 514,
    "evioliteEligible": false
  },
  "515": {
    "speciesId": 515,
    "evioliteEligible": true
  },
  "516": {
    "speciesId": 516,
    "evioliteEligible": false
  },
  "517": {
    "speciesId": 517,
    "evioliteEligible": true
  },
  "518": {
    "speciesId": 518,
    "evioliteEligible": false
  },
  "519": {
    "speciesId": 519,
    "evioliteEligible": true
  },
  "520": {
    "speciesId": 520,
    "evioliteEligible": true
  },
  "521": {
    "speciesId": 521,
    "evioliteEligible": false
  },
  "522": {
    "speciesId": 522,
    "evioliteEligible": true
  },
  "523": {
    "speciesId": 523,
    "evioliteEligible": false
  },
  "524": {
    "speciesId": 524,
    "evioliteEligible": true
  },
  "525": {
    "speciesId": 525,
    "evioliteEligible": true
  },
  "526": {
    "speciesId": 526,
    "evioliteEligible": false
  },
  "527": {
    "speciesId": 527,
    "evioliteEligible": true
  },
  "528": {
    "speciesId": 528,
    "evioliteEligible": false
  },
  "529": {
    "speciesId": 529,
    "evioliteEligible": true
  },
  "530": {
    "speciesId": 530,
    "evioliteEligible": false
  },
  "531": {
    "speciesId": 531,
    "evioliteEligible": false
  },
  "532": {
    "speciesId": 532,
    "evioliteEligible": true
  },
  "533": {
    "speciesId": 533,
    "evioliteEligible": true
  },
  "534": {
    "speciesId": 534,
    "evioliteEligible": false
  },
  "535": {
    "speciesId": 535,
    "evioliteEligible": true
  },
  "536": {
    "speciesId": 536,
    "evioliteEligible": true
  },
  "537": {
    "speciesId": 537,
    "evioliteEligible": false
  },
  "538": {
    "speciesId": 538,
    "evioliteEligible": false
  },
  "539": {
    "speciesId": 539,
    "evioliteEligible": false
  },
  "540": {
    "speciesId": 540,
    "evioliteEligible": true
  },
  "541": {
    "speciesId": 541,
    "evioliteEligible": true
  },
  "542": {
    "speciesId": 542,
    "evioliteEligible": false
  },
  "543": {
    "speciesId": 543,
    "evioliteEligible": true
  },
  "544": {
    "speciesId": 544,
    "evioliteEligible": true
  },
  "545": {
    "speciesId": 545,
    "evioliteEligible": false
  },
  "546": {
    "speciesId": 546,
    "evioliteEligible": true
  },
  "547": {
    "speciesId": 547,
    "evioliteEligible": false
  },
  "548": {
    "speciesId": 548,
    "evioliteEligible": true
  },
  "549": {
    "speciesId": 549,
    "evioliteEligible": false
  },
  "550": {
    "speciesId": 550,
    "evioliteEligible": false
  },
  "551": {
    "speciesId": 551,
    "evioliteEligible": true
  },
  "552": {
    "speciesId": 552,
    "evioliteEligible": true
  },
  "553": {
    "speciesId": 553,
    "evioliteEligible": false
  },
  "554": {
    "speciesId": 554,
    "evioliteEligible": true
  },
  "555": {
    "speciesId": 555,
    "evioliteEligible": false
  },
  "556": {
    "speciesId": 556,
    "evioliteEligible": false
  },
  "557": {
    "speciesId": 557,
    "evioliteEligible": true
  },
  "558": {
    "speciesId": 558,
    "evioliteEligible": false
  },
  "559": {
    "speciesId": 559,
    "evioliteEligible": true
  },
  "560": {
    "speciesId": 560,
    "evioliteEligible": false
  },
  "561": {
    "speciesId": 561,
    "evioliteEligible": false
  },
  "562": {
    "speciesId": 562,
    "evioliteEligible": true
  },
  "563": {
    "speciesId": 563,
    "evioliteEligible": false
  },
  "564": {
    "speciesId": 564,
    "evioliteEligible": true
  },
  "565": {
    "speciesId": 565,
    "evioliteEligible": false
  },
  "566": {
    "speciesId": 566,
    "evioliteEligible": true
  },
  "567": {
    "speciesId": 567,
    "evioliteEligible": false
  },
  "568": {
    "speciesId": 568,
    "evioliteEligible": true
  },
  "569": {
    "speciesId": 569,
    "evioliteEligible": false
  },
  "570": {
    "speciesId": 570,
    "evioliteEligible": true
  },
  "571": {
    "speciesId": 571,
    "evioliteEligible": false
  },
  "572": {
    "speciesId": 572,
    "evioliteEligible": true
  },
  "573": {
    "speciesId": 573,
    "evioliteEligible": false
  },
  "574": {
    "speciesId": 574,
    "evioliteEligible": true
  },
  "575": {
    "speciesId": 575,
    "evioliteEligible": true
  },
  "576": {
    "speciesId": 576,
    "evioliteEligible": false
  },
  "577": {
    "speciesId": 577,
    "evioliteEligible": true
  },
  "578": {
    "speciesId": 578,
    "evioliteEligible": true
  },
  "579": {
    "speciesId": 579,
    "evioliteEligible": false
  },
  "580": {
    "speciesId": 580,
    "evioliteEligible": true
  },
  "581": {
    "speciesId": 581,
    "evioliteEligible": false
  },
  "582": {
    "speciesId": 582,
    "evioliteEligible": true
  },
  "583": {
    "speciesId": 583,
    "evioliteEligible": true
  },
  "584": {
    "speciesId": 584,
    "evioliteEligible": false
  },
  "585": {
    "speciesId": 585,
    "evioliteEligible": true
  },
  "586": {
    "speciesId": 586,
    "evioliteEligible": false
  },
  "587": {
    "speciesId": 587,
    "evioliteEligible": false
  },
  "588": {
    "speciesId": 588,
    "evioliteEligible": true
  },
  "589": {
    "speciesId": 589,
    "evioliteEligible": false
  },
  "590": {
    "speciesId": 590,
    "evioliteEligible": true
  },
  "591": {
    "speciesId": 591,
    "evioliteEligible": false
  },
  "592": {
    "speciesId": 592,
    "evioliteEligible": true
  },
  "593": {
    "speciesId": 593,
    "evioliteEligible": false
  },
  "594": {
    "speciesId": 594,
    "evioliteEligible": false
  },
  "595": {
    "speciesId": 595,
    "evioliteEligible": true
  },
  "596": {
    "speciesId": 596,
    "evioliteEligible": false
  },
  "597": {
    "speciesId": 597,
    "evioliteEligible": true
  },
  "598": {
    "speciesId": 598,
    "evioliteEligible": false
  },
  "599": {
    "speciesId": 599,
    "evioliteEligible": true
  },
  "600": {
    "speciesId": 600,
    "evioliteEligible": true
  },
  "601": {
    "speciesId": 601,
    "evioliteEligible": false
  },
  "602": {
    "speciesId": 602,
    "evioliteEligible": true
  },
  "603": {
    "speciesId": 603,
    "evioliteEligible": true
  },
  "604": {
    "speciesId": 604,
    "evioliteEligible": false
  },
  "605": {
    "speciesId": 605,
    "evioliteEligible": true
  },
  "606": {
    "speciesId": 606,
    "evioliteEligible": false
  },
  "607": {
    "speciesId": 607,
    "evioliteEligible": true
  },
  "608": {
    "speciesId": 608,
    "evioliteEligible": true
  },
  "609": {
    "speciesId": 609,
    "evioliteEligible": false
  },
  "610": {
    "speciesId": 610,
    "evioliteEligible": true
  },
  "611": {
    "speciesId": 611,
    "evioliteEligible": true
  },
  "612": {
    "speciesId": 612,
    "evioliteEligible": false
  },
  "613": {
    "speciesId": 613,
    "evioliteEligible": true
  },
  "614": {
    "speciesId": 614,
    "evioliteEligible": false
  },
  "615": {
    "speciesId": 615,
    "evioliteEligible": false
  },
  "616": {
    "speciesId": 616,
    "evioliteEligible": true
  },
  "617": {
    "speciesId": 617,
    "evioliteEligible": false
  },
  "618": {
    "speciesId": 618,
    "evioliteEligible": false
  },
  "619": {
    "speciesId": 619,
    "evioliteEligible": true
  },
  "620": {
    "speciesId": 620,
    "evioliteEligible": false
  },
  "621": {
    "speciesId": 621,
    "evioliteEligible": false
  },
  "622": {
    "speciesId": 622,
    "evioliteEligible": true
  },
  "623": {
    "speciesId": 623,
    "evioliteEligible": false
  },
  "624": {
    "speciesId": 624,
    "evioliteEligible": true
  },
  "625": {
    "speciesId": 625,
    "evioliteEligible": true
  },
  "626": {
    "speciesId": 626,
    "evioliteEligible": false
  },
  "627": {
    "speciesId": 627,
    "evioliteEligible": true
  },
  "628": {
    "speciesId": 628,
    "evioliteEligible": false
  },
  "629": {
    "speciesId": 629,
    "evioliteEligible": true
  },
  "630": {
    "speciesId": 630,
    "evioliteEligible": false
  },
  "631": {
    "speciesId": 631,
    "evioliteEligible": false
  },
  "632": {
    "speciesId": 632,
    "evioliteEligible": false
  },
  "633": {
    "speciesId": 633,
    "evioliteEligible": true
  },
  "634": {
    "speciesId": 634,
    "evioliteEligible": true
  },
  "635": {
    "speciesId": 635,
    "evioliteEligible": false
  },
  "636": {
    "speciesId": 636,
    "evioliteEligible": true
  },
  "637": {
    "speciesId": 637,
    "evioliteEligible": false
  },
  "638": {
    "speciesId": 638,
    "evioliteEligible": false
  },
  "639": {
    "speciesId": 639,
    "evioliteEligible": false
  },
  "640": {
    "speciesId": 640,
    "evioliteEligible": false
  },
  "641": {
    "speciesId": 641,
    "evioliteEligible": false
  },
  "642": {
    "speciesId": 642,
    "evioliteEligible": false
  },
  "643": {
    "speciesId": 643,
    "evioliteEligible": false
  },
  "644": {
    "speciesId": 644,
    "evioliteEligible": false
  },
  "645": {
    "speciesId": 645,
    "evioliteEligible": false
  },
  "646": {
    "speciesId": 646,
    "evioliteEligible": false
  },
  "647": {
    "speciesId": 647,
    "evioliteEligible": false
  },
  "648": {
    "speciesId": 648,
    "evioliteEligible": false
  },
  "649": {
    "speciesId": 649,
    "evioliteEligible": false
  },
  "650": {
    "speciesId": 650,
    "evioliteEligible": true
  },
  "651": {
    "speciesId": 651,
    "evioliteEligible": true
  },
  "652": {
    "speciesId": 652,
    "evioliteEligible": false
  },
  "653": {
    "speciesId": 653,
    "evioliteEligible": true
  },
  "654": {
    "speciesId": 654,
    "evioliteEligible": true
  },
  "655": {
    "speciesId": 655,
    "evioliteEligible": false
  },
  "656": {
    "speciesId": 656,
    "evioliteEligible": true
  },
  "657": {
    "speciesId": 657,
    "evioliteEligible": true
  },
  "658": {
    "speciesId": 658,
    "evioliteEligible": false
  },
  "659": {
    "speciesId": 659,
    "evioliteEligible": true
  },
  "660": {
    "speciesId": 660,
    "evioliteEligible": false
  },
  "661": {
    "speciesId": 661,
    "evioliteEligible": true
  },
  "662": {
    "speciesId": 662,
    "evioliteEligible": true
  },
  "663": {
    "speciesId": 663,
    "evioliteEligible": false
  },
  "664": {
    "speciesId": 664,
    "evioliteEligible": true
  },
  "665": {
    "speciesId": 665,
    "evioliteEligible": true
  },
  "666": {
    "speciesId": 666,
    "evioliteEligible": false
  },
  "667": {
    "speciesId": 667,
    "evioliteEligible": true
  },
  "668": {
    "speciesId": 668,
    "evioliteEligible": false
  },
  "669": {
    "speciesId": 669,
    "evioliteEligible": true
  },
  "670": {
    "speciesId": 670,
    "evioliteEligible": true
  },
  "671": {
    "speciesId": 671,
    "evioliteEligible": false
  },
  "672": {
    "speciesId": 672,
    "evioliteEligible": true
  },
  "673": {
    "speciesId": 673,
    "evioliteEligible": false
  },
  "674": {
    "speciesId": 674,
    "evioliteEligible": true
  },
  "675": {
    "speciesId": 675,
    "evioliteEligible": false
  },
  "676": {
    "speciesId": 676,
    "evioliteEligible": false
  },
  "677": {
    "speciesId": 677,
    "evioliteEligible": true
  },
  "678": {
    "speciesId": 678,
    "evioliteEligible": false
  },
  "679": {
    "speciesId": 679,
    "evioliteEligible": true
  },
  "680": {
    "speciesId": 680,
    "evioliteEligible": true
  },
  "681": {
    "speciesId": 681,
    "evioliteEligible": false
  },
  "682": {
    "speciesId": 682,
    "evioliteEligible": true
  },
  "683": {
    "speciesId": 683,
    "evioliteEligible": false
  },
  "684": {
    "speciesId": 684,
    "evioliteEligible": true
  },
  "685": {
    "speciesId": 685,
    "evioliteEligible": false
  },
  "686": {
    "speciesId": 686,
    "evioliteEligible": true
  },
  "687": {
    "speciesId": 687,
    "evioliteEligible": false
  },
  "688": {
    "speciesId": 688,
    "evioliteEligible": true
  },
  "689": {
    "speciesId": 689,
    "evioliteEligible": false
  },
  "690": {
    "speciesId": 690,
    "evioliteEligible": true
  },
  "691": {
    "speciesId": 691,
    "evioliteEligible": false
  },
  "692": {
    "speciesId": 692,
    "evioliteEligible": true
  },
  "693": {
    "speciesId": 693,
    "evioliteEligible": false
  },
  "694": {
    "speciesId": 694,
    "evioliteEligible": true
  },
  "695": {
    "speciesId": 695,
    "evioliteEligible": false
  },
  "696": {
    "speciesId": 696,
    "evioliteEligible": true
  },
  "697": {
    "speciesId": 697,
    "evioliteEligible": false
  },
  "698": {
    "speciesId": 698,
    "evioliteEligible": true
  },
  "699": {
    "speciesId": 699,
    "evioliteEligible": false
  },
  "700": {
    "speciesId": 700,
    "evioliteEligible": false
  },
  "701": {
    "speciesId": 701,
    "evioliteEligible": false
  },
  "702": {
    "speciesId": 702,
    "evioliteEligible": false
  },
  "703": {
    "speciesId": 703,
    "evioliteEligible": false
  },
  "704": {
    "speciesId": 704,
    "evioliteEligible": true
  },
  "705": {
    "speciesId": 705,
    "evioliteEligible": true
  },
  "706": {
    "speciesId": 706,
    "evioliteEligible": false
  },
  "707": {
    "speciesId": 707,
    "evioliteEligible": false
  },
  "708": {
    "speciesId": 708,
    "evioliteEligible": true
  },
  "709": {
    "speciesId": 709,
    "evioliteEligible": false
  },
  "710": {
    "speciesId": 710,
    "evioliteEligible": true
  },
  "711": {
    "speciesId": 711,
    "evioliteEligible": false
  },
  "712": {
    "speciesId": 712,
    "evioliteEligible": true
  },
  "713": {
    "speciesId": 713,
    "evioliteEligible": false
  },
  "714": {
    "speciesId": 714,
    "evioliteEligible": true
  },
  "715": {
    "speciesId": 715,
    "evioliteEligible": false
  },
  "716": {
    "speciesId": 716,
    "evioliteEligible": false
  },
  "717": {
    "speciesId": 717,
    "evioliteEligible": false
  },
  "718": {
    "speciesId": 718,
    "evioliteEligible": false
  },
  "719": {
    "speciesId": 719,
    "evioliteEligible": false
  },
  "720": {
    "speciesId": 720,
    "evioliteEligible": false
  },
  "721": {
    "speciesId": 721,
    "evioliteEligible": false
  },
  "722": {
    "speciesId": 722,
    "evioliteEligible": true
  },
  "723": {
    "speciesId": 723,
    "evioliteEligible": true
  },
  "724": {
    "speciesId": 724,
    "evioliteEligible": false
  },
  "725": {
    "speciesId": 725,
    "evioliteEligible": true
  },
  "726": {
    "speciesId": 726,
    "evioliteEligible": true
  },
  "727": {
    "speciesId": 727,
    "evioliteEligible": false
  },
  "728": {
    "speciesId": 728,
    "evioliteEligible": true
  },
  "729": {
    "speciesId": 729,
    "evioliteEligible": true
  },
  "730": {
    "speciesId": 730,
    "evioliteEligible": false
  },
  "731": {
    "speciesId": 731,
    "evioliteEligible": true
  },
  "732": {
    "speciesId": 732,
    "evioliteEligible": true
  },
  "733": {
    "speciesId": 733,
    "evioliteEligible": false
  },
  "734": {
    "speciesId": 734,
    "evioliteEligible": true
  },
  "735": {
    "speciesId": 735,
    "evioliteEligible": false
  },
  "736": {
    "speciesId": 736,
    "evioliteEligible": true
  },
  "737": {
    "speciesId": 737,
    "evioliteEligible": true
  },
  "738": {
    "speciesId": 738,
    "evioliteEligible": false
  },
  "739": {
    "speciesId": 739,
    "evioliteEligible": true
  },
  "740": {
    "speciesId": 740,
    "evioliteEligible": false
  },
  "741": {
    "speciesId": 741,
    "evioliteEligible": false
  },
  "742": {
    "speciesId": 742,
    "evioliteEligible": true
  },
  "743": {
    "speciesId": 743,
    "evioliteEligible": false
  },
  "744": {
    "speciesId": 744,
    "evioliteEligible": true
  },
  "745": {
    "speciesId": 745,
    "evioliteEligible": false
  },
  "746": {
    "speciesId": 746,
    "evioliteEligible": false
  },
  "747": {
    "speciesId": 747,
    "evioliteEligible": true
  },
  "748": {
    "speciesId": 748,
    "evioliteEligible": false
  },
  "749": {
    "speciesId": 749,
    "evioliteEligible": true
  },
  "750": {
    "speciesId": 750,
    "evioliteEligible": false
  },
  "751": {
    "speciesId": 751,
    "evioliteEligible": true
  },
  "752": {
    "speciesId": 752,
    "evioliteEligible": false
  },
  "753": {
    "speciesId": 753,
    "evioliteEligible": true
  },
  "754": {
    "speciesId": 754,
    "evioliteEligible": false
  },
  "755": {
    "speciesId": 755,
    "evioliteEligible": true
  },
  "756": {
    "speciesId": 756,
    "evioliteEligible": false
  },
  "757": {
    "speciesId": 757,
    "evioliteEligible": true
  },
  "758": {
    "speciesId": 758,
    "evioliteEligible": false
  },
  "759": {
    "speciesId": 759,
    "evioliteEligible": true
  },
  "760": {
    "speciesId": 760,
    "evioliteEligible": false
  },
  "761": {
    "speciesId": 761,
    "evioliteEligible": true
  },
  "762": {
    "speciesId": 762,
    "evioliteEligible": true
  },
  "763": {
    "speciesId": 763,
    "evioliteEligible": false
  },
  "764": {
    "speciesId": 764,
    "evioliteEligible": false
  },
  "765": {
    "speciesId": 765,
    "evioliteEligible": false
  },
  "766": {
    "speciesId": 766,
    "evioliteEligible": false
  },
  "767": {
    "speciesId": 767,
    "evioliteEligible": true
  },
  "768": {
    "speciesId": 768,
    "evioliteEligible": false
  },
  "769": {
    "speciesId": 769,
    "evioliteEligible": true
  },
  "770": {
    "speciesId": 770,
    "evioliteEligible": false
  },
  "771": {
    "speciesId": 771,
    "evioliteEligible": false
  },
  "772": {
    "speciesId": 772,
    "evioliteEligible": true
  },
  "773": {
    "speciesId": 773,
    "evioliteEligible": false
  },
  "774": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "775": {
    "speciesId": 775,
    "evioliteEligible": false
  },
  "776": {
    "speciesId": 776,
    "evioliteEligible": false
  },
  "777": {
    "speciesId": 777,
    "evioliteEligible": false
  },
  "778": {
    "speciesId": 778,
    "evioliteEligible": false
  },
  "779": {
    "speciesId": 779,
    "evioliteEligible": false
  },
  "780": {
    "speciesId": 780,
    "evioliteEligible": false
  },
  "781": {
    "speciesId": 781,
    "evioliteEligible": false
  },
  "782": {
    "speciesId": 782,
    "evioliteEligible": true
  },
  "783": {
    "speciesId": 783,
    "evioliteEligible": true
  },
  "784": {
    "speciesId": 784,
    "evioliteEligible": false
  },
  "785": {
    "speciesId": 785,
    "evioliteEligible": false
  },
  "786": {
    "speciesId": 786,
    "evioliteEligible": false
  },
  "787": {
    "speciesId": 787,
    "evioliteEligible": false
  },
  "788": {
    "speciesId": 788,
    "evioliteEligible": false
  },
  "789": {
    "speciesId": 789,
    "evioliteEligible": true
  },
  "790": {
    "speciesId": 790,
    "evioliteEligible": true
  },
  "791": {
    "speciesId": 791,
    "evioliteEligible": false
  },
  "792": {
    "speciesId": 792,
    "evioliteEligible": false
  },
  "793": {
    "speciesId": 793,
    "evioliteEligible": false
  },
  "794": {
    "speciesId": 794,
    "evioliteEligible": false
  },
  "795": {
    "speciesId": 795,
    "evioliteEligible": false
  },
  "796": {
    "speciesId": 796,
    "evioliteEligible": false
  },
  "797": {
    "speciesId": 797,
    "evioliteEligible": false
  },
  "798": {
    "speciesId": 798,
    "evioliteEligible": false
  },
  "799": {
    "speciesId": 799,
    "evioliteEligible": false
  },
  "800": {
    "speciesId": 800,
    "evioliteEligible": false
  },
  "801": {
    "speciesId": 801,
    "evioliteEligible": false
  },
  "802": {
    "speciesId": 802,
    "evioliteEligible": false
  },
  "803": {
    "speciesId": 803,
    "evioliteEligible": true
  },
  "804": {
    "speciesId": 804,
    "evioliteEligible": false
  },
  "805": {
    "speciesId": 805,
    "evioliteEligible": false
  },
  "806": {
    "speciesId": 806,
    "evioliteEligible": false
  },
  "807": {
    "speciesId": 807,
    "evioliteEligible": false
  },
  "808": {
    "speciesId": 808,
    "evioliteEligible": false
  },
  "809": {
    "speciesId": 809,
    "evioliteEligible": false
  },
  "810": {
    "speciesId": 810,
    "evioliteEligible": true
  },
  "811": {
    "speciesId": 811,
    "evioliteEligible": true
  },
  "812": {
    "speciesId": 812,
    "evioliteEligible": false
  },
  "813": {
    "speciesId": 813,
    "evioliteEligible": true
  },
  "814": {
    "speciesId": 814,
    "evioliteEligible": true
  },
  "815": {
    "speciesId": 815,
    "evioliteEligible": false
  },
  "816": {
    "speciesId": 816,
    "evioliteEligible": true
  },
  "817": {
    "speciesId": 817,
    "evioliteEligible": true
  },
  "818": {
    "speciesId": 818,
    "evioliteEligible": false
  },
  "819": {
    "speciesId": 819,
    "evioliteEligible": true
  },
  "820": {
    "speciesId": 820,
    "evioliteEligible": false
  },
  "821": {
    "speciesId": 821,
    "evioliteEligible": true
  },
  "822": {
    "speciesId": 822,
    "evioliteEligible": true
  },
  "823": {
    "speciesId": 823,
    "evioliteEligible": false
  },
  "824": {
    "speciesId": 824,
    "evioliteEligible": true
  },
  "825": {
    "speciesId": 825,
    "evioliteEligible": true
  },
  "826": {
    "speciesId": 826,
    "evioliteEligible": false
  },
  "827": {
    "speciesId": 827,
    "evioliteEligible": true
  },
  "828": {
    "speciesId": 828,
    "evioliteEligible": false
  },
  "829": {
    "speciesId": 829,
    "evioliteEligible": true
  },
  "830": {
    "speciesId": 830,
    "evioliteEligible": false
  },
  "831": {
    "speciesId": 831,
    "evioliteEligible": true
  },
  "832": {
    "speciesId": 832,
    "evioliteEligible": false
  },
  "833": {
    "speciesId": 833,
    "evioliteEligible": true
  },
  "834": {
    "speciesId": 834,
    "evioliteEligible": false
  },
  "835": {
    "speciesId": 835,
    "evioliteEligible": true
  },
  "836": {
    "speciesId": 836,
    "evioliteEligible": false
  },
  "837": {
    "speciesId": 837,
    "evioliteEligible": true
  },
  "838": {
    "speciesId": 838,
    "evioliteEligible": true
  },
  "839": {
    "speciesId": 839,
    "evioliteEligible": false
  },
  "840": {
    "speciesId": 840,
    "evioliteEligible": true
  },
  "841": {
    "speciesId": 841,
    "evioliteEligible": false
  },
  "842": {
    "speciesId": 842,
    "evioliteEligible": false
  },
  "843": {
    "speciesId": 843,
    "evioliteEligible": true
  },
  "844": {
    "speciesId": 844,
    "evioliteEligible": false
  },
  "845": {
    "speciesId": 845,
    "evioliteEligible": false
  },
  "846": {
    "speciesId": 846,
    "evioliteEligible": true
  },
  "847": {
    "speciesId": 847,
    "evioliteEligible": false
  },
  "848": {
    "speciesId": 848,
    "evioliteEligible": true
  },
  "849": {
    "speciesId": 849,
    "evioliteEligible": false
  },
  "850": {
    "speciesId": 850,
    "evioliteEligible": true
  },
  "851": {
    "speciesId": 851,
    "evioliteEligible": false
  },
  "852": {
    "speciesId": 852,
    "evioliteEligible": true
  },
  "853": {
    "speciesId": 853,
    "evioliteEligible": false
  },
  "854": {
    "speciesId": 854,
    "evioliteEligible": true
  },
  "855": {
    "speciesId": 855,
    "evioliteEligible": false
  },
  "856": {
    "speciesId": 856,
    "evioliteEligible": true
  },
  "857": {
    "speciesId": 857,
    "evioliteEligible": true
  },
  "858": {
    "speciesId": 858,
    "evioliteEligible": false
  },
  "859": {
    "speciesId": 859,
    "evioliteEligible": true
  },
  "860": {
    "speciesId": 860,
    "evioliteEligible": true
  },
  "861": {
    "speciesId": 861,
    "evioliteEligible": false
  },
  "862": {
    "speciesId": 862,
    "evioliteEligible": false
  },
  "863": {
    "speciesId": 863,
    "evioliteEligible": false
  },
  "864": {
    "speciesId": 864,
    "evioliteEligible": false
  },
  "865": {
    "speciesId": 865,
    "evioliteEligible": false
  },
  "866": {
    "speciesId": 866,
    "evioliteEligible": false
  },
  "867": {
    "speciesId": 867,
    "evioliteEligible": false
  },
  "868": {
    "speciesId": 868,
    "evioliteEligible": true
  },
  "869": {
    "speciesId": 869,
    "evioliteEligible": false
  },
  "870": {
    "speciesId": 870,
    "evioliteEligible": false
  },
  "871": {
    "speciesId": 871,
    "evioliteEligible": false
  },
  "872": {
    "speciesId": 872,
    "evioliteEligible": true
  },
  "873": {
    "speciesId": 873,
    "evioliteEligible": false
  },
  "874": {
    "speciesId": 874,
    "evioliteEligible": false
  },
  "875": {
    "speciesId": 875,
    "evioliteEligible": false
  },
  "876": {
    "speciesId": 876,
    "evioliteEligible": false
  },
  "877": {
    "speciesId": 877,
    "evioliteEligible": false
  },
  "878": {
    "speciesId": 878,
    "evioliteEligible": true
  },
  "879": {
    "speciesId": 879,
    "evioliteEligible": false
  },
  "880": {
    "speciesId": 880,
    "evioliteEligible": false
  },
  "881": {
    "speciesId": 881,
    "evioliteEligible": false
  },
  "882": {
    "speciesId": 882,
    "evioliteEligible": false
  },
  "883": {
    "speciesId": 883,
    "evioliteEligible": false
  },
  "884": {
    "speciesId": 884,
    "evioliteEligible": true
  },
  "885": {
    "speciesId": 885,
    "evioliteEligible": true
  },
  "886": {
    "speciesId": 886,
    "evioliteEligible": true
  },
  "887": {
    "speciesId": 887,
    "evioliteEligible": false
  },
  "888": {
    "speciesId": 888,
    "evioliteEligible": false
  },
  "889": {
    "speciesId": 889,
    "evioliteEligible": false
  },
  "890": {
    "speciesId": 890,
    "evioliteEligible": false
  },
  "891": {
    "speciesId": 891,
    "evioliteEligible": true
  },
  "892": {
    "speciesId": 892,
    "evioliteEligible": false
  },
  "893": {
    "speciesId": 893,
    "evioliteEligible": false
  },
  "894": {
    "speciesId": 894,
    "evioliteEligible": false
  },
  "895": {
    "speciesId": 895,
    "evioliteEligible": false
  },
  "896": {
    "speciesId": 896,
    "evioliteEligible": false
  },
  "897": {
    "speciesId": 897,
    "evioliteEligible": false
  },
  "898": {
    "speciesId": 898,
    "evioliteEligible": false
  },
  "899": {
    "speciesId": 899,
    "evioliteEligible": false
  },
  "900": {
    "speciesId": 900,
    "evioliteEligible": false
  },
  "901": {
    "speciesId": 901,
    "evioliteEligible": false
  },
  "902": {
    "speciesId": 902,
    "evioliteEligible": false
  },
  "903": {
    "speciesId": 903,
    "evioliteEligible": false
  },
  "904": {
    "speciesId": 904,
    "evioliteEligible": false
  },
  "905": {
    "speciesId": 905,
    "evioliteEligible": false
  },
  "906": {
    "speciesId": 906,
    "evioliteEligible": true
  },
  "907": {
    "speciesId": 907,
    "evioliteEligible": true
  },
  "908": {
    "speciesId": 908,
    "evioliteEligible": false
  },
  "909": {
    "speciesId": 909,
    "evioliteEligible": true
  },
  "910": {
    "speciesId": 910,
    "evioliteEligible": true
  },
  "911": {
    "speciesId": 911,
    "evioliteEligible": false
  },
  "912": {
    "speciesId": 912,
    "evioliteEligible": true
  },
  "913": {
    "speciesId": 913,
    "evioliteEligible": true
  },
  "914": {
    "speciesId": 914,
    "evioliteEligible": false
  },
  "915": {
    "speciesId": 915,
    "evioliteEligible": true
  },
  "916": {
    "speciesId": 916,
    "evioliteEligible": false
  },
  "917": {
    "speciesId": 917,
    "evioliteEligible": true
  },
  "918": {
    "speciesId": 918,
    "evioliteEligible": false
  },
  "919": {
    "speciesId": 919,
    "evioliteEligible": true
  },
  "920": {
    "speciesId": 920,
    "evioliteEligible": false
  },
  "921": {
    "speciesId": 921,
    "evioliteEligible": true
  },
  "922": {
    "speciesId": 922,
    "evioliteEligible": true
  },
  "923": {
    "speciesId": 923,
    "evioliteEligible": false
  },
  "924": {
    "speciesId": 924,
    "evioliteEligible": true
  },
  "925": {
    "speciesId": 925,
    "evioliteEligible": false
  },
  "926": {
    "speciesId": 926,
    "evioliteEligible": true
  },
  "927": {
    "speciesId": 927,
    "evioliteEligible": false
  },
  "928": {
    "speciesId": 928,
    "evioliteEligible": true
  },
  "929": {
    "speciesId": 929,
    "evioliteEligible": true
  },
  "930": {
    "speciesId": 930,
    "evioliteEligible": false
  },
  "931": {
    "speciesId": 931,
    "evioliteEligible": false
  },
  "932": {
    "speciesId": 932,
    "evioliteEligible": true
  },
  "933": {
    "speciesId": 933,
    "evioliteEligible": true
  },
  "934": {
    "speciesId": 934,
    "evioliteEligible": false
  },
  "935": {
    "speciesId": 935,
    "evioliteEligible": true
  },
  "936": {
    "speciesId": 936,
    "evioliteEligible": false
  },
  "937": {
    "speciesId": 937,
    "evioliteEligible": false
  },
  "938": {
    "speciesId": 938,
    "evioliteEligible": true
  },
  "939": {
    "speciesId": 939,
    "evioliteEligible": false
  },
  "940": {
    "speciesId": 940,
    "evioliteEligible": true
  },
  "941": {
    "speciesId": 941,
    "evioliteEligible": false
  },
  "942": {
    "speciesId": 942,
    "evioliteEligible": true
  },
  "943": {
    "speciesId": 943,
    "evioliteEligible": false
  },
  "944": {
    "speciesId": 944,
    "evioliteEligible": true
  },
  "945": {
    "speciesId": 945,
    "evioliteEligible": false
  },
  "946": {
    "speciesId": 946,
    "evioliteEligible": true
  },
  "947": {
    "speciesId": 947,
    "evioliteEligible": false
  },
  "948": {
    "speciesId": 948,
    "evioliteEligible": true
  },
  "949": {
    "speciesId": 949,
    "evioliteEligible": false
  },
  "950": {
    "speciesId": 950,
    "evioliteEligible": false
  },
  "951": {
    "speciesId": 951,
    "evioliteEligible": true
  },
  "952": {
    "speciesId": 952,
    "evioliteEligible": false
  },
  "953": {
    "speciesId": 953,
    "evioliteEligible": true
  },
  "954": {
    "speciesId": 954,
    "evioliteEligible": false
  },
  "955": {
    "speciesId": 955,
    "evioliteEligible": true
  },
  "956": {
    "speciesId": 956,
    "evioliteEligible": false
  },
  "957": {
    "speciesId": 957,
    "evioliteEligible": true
  },
  "958": {
    "speciesId": 958,
    "evioliteEligible": true
  },
  "959": {
    "speciesId": 959,
    "evioliteEligible": false
  },
  "960": {
    "speciesId": 960,
    "evioliteEligible": true
  },
  "961": {
    "speciesId": 961,
    "evioliteEligible": false
  },
  "962": {
    "speciesId": 962,
    "evioliteEligible": false
  },
  "963": {
    "speciesId": 963,
    "evioliteEligible": true
  },
  "964": {
    "speciesId": 964,
    "evioliteEligible": false
  },
  "965": {
    "speciesId": 965,
    "evioliteEligible": true
  },
  "966": {
    "speciesId": 966,
    "evioliteEligible": false
  },
  "967": {
    "speciesId": 967,
    "evioliteEligible": false
  },
  "968": {
    "speciesId": 968,
    "evioliteEligible": false
  },
  "969": {
    "speciesId": 969,
    "evioliteEligible": true
  },
  "970": {
    "speciesId": 970,
    "evioliteEligible": false
  },
  "971": {
    "speciesId": 971,
    "evioliteEligible": true
  },
  "972": {
    "speciesId": 972,
    "evioliteEligible": false
  },
  "973": {
    "speciesId": 973,
    "evioliteEligible": false
  },
  "974": {
    "speciesId": 974,
    "evioliteEligible": true
  },
  "975": {
    "speciesId": 975,
    "evioliteEligible": false
  },
  "976": {
    "speciesId": 976,
    "evioliteEligible": false
  },
  "977": {
    "speciesId": 977,
    "evioliteEligible": false
  },
  "978": {
    "speciesId": 978,
    "evioliteEligible": false
  },
  "979": {
    "speciesId": 979,
    "evioliteEligible": false
  },
  "980": {
    "speciesId": 980,
    "evioliteEligible": false
  },
  "981": {
    "speciesId": 981,
    "evioliteEligible": false
  },
  "982": {
    "speciesId": 982,
    "evioliteEligible": false
  },
  "983": {
    "speciesId": 983,
    "evioliteEligible": false
  },
  "984": {
    "speciesId": 984,
    "evioliteEligible": false
  },
  "985": {
    "speciesId": 985,
    "evioliteEligible": false
  },
  "986": {
    "speciesId": 986,
    "evioliteEligible": false
  },
  "987": {
    "speciesId": 987,
    "evioliteEligible": false
  },
  "988": {
    "speciesId": 988,
    "evioliteEligible": false
  },
  "989": {
    "speciesId": 989,
    "evioliteEligible": false
  },
  "990": {
    "speciesId": 990,
    "evioliteEligible": false
  },
  "991": {
    "speciesId": 991,
    "evioliteEligible": false
  },
  "992": {
    "speciesId": 992,
    "evioliteEligible": false
  },
  "993": {
    "speciesId": 993,
    "evioliteEligible": false
  },
  "994": {
    "speciesId": 994,
    "evioliteEligible": false
  },
  "995": {
    "speciesId": 995,
    "evioliteEligible": false
  },
  "996": {
    "speciesId": 996,
    "evioliteEligible": true
  },
  "997": {
    "speciesId": 997,
    "evioliteEligible": true
  },
  "998": {
    "speciesId": 998,
    "evioliteEligible": false
  },
  "999": {
    "speciesId": 999,
    "evioliteEligible": true
  },
  "1000": {
    "speciesId": 1000,
    "evioliteEligible": false
  },
  "1001": {
    "speciesId": 1001,
    "evioliteEligible": false
  },
  "1002": {
    "speciesId": 1002,
    "evioliteEligible": false
  },
  "1003": {
    "speciesId": 1003,
    "evioliteEligible": false
  },
  "1004": {
    "speciesId": 1004,
    "evioliteEligible": false
  },
  "1005": {
    "speciesId": 1005,
    "evioliteEligible": false
  },
  "1006": {
    "speciesId": 1006,
    "evioliteEligible": false
  },
  "1007": {
    "speciesId": 1007,
    "evioliteEligible": false
  },
  "1008": {
    "speciesId": 1008,
    "evioliteEligible": false
  },
  "1009": {
    "speciesId": 1009,
    "evioliteEligible": false
  },
  "1010": {
    "speciesId": 1010,
    "evioliteEligible": false
  },
  "1011": {
    "speciesId": 1011,
    "evioliteEligible": true
  },
  "1012": {
    "speciesId": 1012,
    "evioliteEligible": true
  },
  "1013": {
    "speciesId": 1013,
    "evioliteEligible": false
  },
  "1014": {
    "speciesId": 1014,
    "evioliteEligible": false
  },
  "1015": {
    "speciesId": 1015,
    "evioliteEligible": false
  },
  "1016": {
    "speciesId": 1016,
    "evioliteEligible": false
  },
  "1017": {
    "speciesId": 1017,
    "evioliteEligible": false
  },
  "1018": {
    "speciesId": 1018,
    "evioliteEligible": false
  },
  "1019": {
    "speciesId": 1019,
    "evioliteEligible": false
  },
  "1020": {
    "speciesId": 1020,
    "evioliteEligible": false
  },
  "1021": {
    "speciesId": 1021,
    "evioliteEligible": false
  },
  "1022": {
    "speciesId": 1022,
    "evioliteEligible": false
  },
  "1023": {
    "speciesId": 1023,
    "evioliteEligible": false
  },
  "1024": {
    "speciesId": 1024,
    "evioliteEligible": false
  },
  "1025": {
    "speciesId": 1025,
    "evioliteEligible": false
  },
  "10001": {
    "speciesId": 386,
    "evioliteEligible": false
  },
  "10002": {
    "speciesId": 386,
    "evioliteEligible": false
  },
  "10003": {
    "speciesId": 386,
    "evioliteEligible": false
  },
  "10004": {
    "speciesId": 413,
    "evioliteEligible": false
  },
  "10005": {
    "speciesId": 413,
    "evioliteEligible": false
  },
  "10006": {
    "speciesId": 492,
    "evioliteEligible": false
  },
  "10007": {
    "speciesId": 487,
    "evioliteEligible": false
  },
  "10008": {
    "speciesId": 479,
    "evioliteEligible": false
  },
  "10009": {
    "speciesId": 479,
    "evioliteEligible": false
  },
  "10010": {
    "speciesId": 479,
    "evioliteEligible": false
  },
  "10011": {
    "speciesId": 479,
    "evioliteEligible": false
  },
  "10012": {
    "speciesId": 479,
    "evioliteEligible": false
  },
  "10013": {
    "speciesId": 351,
    "evioliteEligible": false
  },
  "10014": {
    "speciesId": 351,
    "evioliteEligible": false
  },
  "10015": {
    "speciesId": 351,
    "evioliteEligible": false
  },
  "10016": {
    "speciesId": 550,
    "evioliteEligible": false
  },
  "10017": {
    "speciesId": 555,
    "evioliteEligible": false
  },
  "10018": {
    "speciesId": 648,
    "evioliteEligible": false
  },
  "10019": {
    "speciesId": 641,
    "evioliteEligible": false
  },
  "10020": {
    "speciesId": 642,
    "evioliteEligible": false
  },
  "10021": {
    "speciesId": 645,
    "evioliteEligible": false
  },
  "10022": {
    "speciesId": 646,
    "evioliteEligible": false
  },
  "10023": {
    "speciesId": 646,
    "evioliteEligible": false
  },
  "10024": {
    "speciesId": 647,
    "evioliteEligible": false
  },
  "10025": {
    "speciesId": 678,
    "evioliteEligible": false
  },
  "10026": {
    "speciesId": 681,
    "evioliteEligible": false
  },
  "10027": {
    "speciesId": 710,
    "evioliteEligible": true
  },
  "10028": {
    "speciesId": 710,
    "evioliteEligible": true
  },
  "10029": {
    "speciesId": 710,
    "evioliteEligible": true
  },
  "10030": {
    "speciesId": 711,
    "evioliteEligible": false
  },
  "10031": {
    "speciesId": 711,
    "evioliteEligible": false
  },
  "10032": {
    "speciesId": 711,
    "evioliteEligible": false
  },
  "10033": {
    "speciesId": 3,
    "evioliteEligible": false
  },
  "10034": {
    "speciesId": 6,
    "evioliteEligible": false
  },
  "10035": {
    "speciesId": 6,
    "evioliteEligible": false
  },
  "10036": {
    "speciesId": 9,
    "evioliteEligible": false
  },
  "10037": {
    "speciesId": 65,
    "evioliteEligible": false
  },
  "10038": {
    "speciesId": 94,
    "evioliteEligible": false
  },
  "10039": {
    "speciesId": 115,
    "evioliteEligible": false
  },
  "10040": {
    "speciesId": 127,
    "evioliteEligible": false
  },
  "10041": {
    "speciesId": 130,
    "evioliteEligible": false
  },
  "10042": {
    "speciesId": 142,
    "evioliteEligible": false
  },
  "10043": {
    "speciesId": 150,
    "evioliteEligible": false
  },
  "10044": {
    "speciesId": 150,
    "evioliteEligible": false
  },
  "10045": {
    "speciesId": 181,
    "evioliteEligible": false
  },
  "10046": {
    "speciesId": 212,
    "evioliteEligible": false
  },
  "10047": {
    "speciesId": 214,
    "evioliteEligible": false
  },
  "10048": {
    "speciesId": 229,
    "evioliteEligible": false
  },
  "10049": {
    "speciesId": 248,
    "evioliteEligible": false
  },
  "10050": {
    "speciesId": 257,
    "evioliteEligible": false
  },
  "10051": {
    "speciesId": 282,
    "evioliteEligible": false
  },
  "10052": {
    "speciesId": 303,
    "evioliteEligible": false
  },
  "10053": {
    "speciesId": 306,
    "evioliteEligible": false
  },
  "10054": {
    "speciesId": 308,
    "evioliteEligible": false
  },
  "10055": {
    "speciesId": 310,
    "evioliteEligible": false
  },
  "10056": {
    "speciesId": 354,
    "evioliteEligible": false
  },
  "10057": {
    "speciesId": 359,
    "evioliteEligible": false
  },
  "10058": {
    "speciesId": 445,
    "evioliteEligible": false
  },
  "10059": {
    "speciesId": 448,
    "evioliteEligible": false
  },
  "10060": {
    "speciesId": 460,
    "evioliteEligible": false
  },
  "10061": {
    "speciesId": 670,
    "evioliteEligible": false
  },
  "10062": {
    "speciesId": 380,
    "evioliteEligible": false
  },
  "10063": {
    "speciesId": 381,
    "evioliteEligible": false
  },
  "10064": {
    "speciesId": 260,
    "evioliteEligible": false
  },
  "10065": {
    "speciesId": 254,
    "evioliteEligible": false
  },
  "10066": {
    "speciesId": 302,
    "evioliteEligible": false
  },
  "10067": {
    "speciesId": 334,
    "evioliteEligible": false
  },
  "10068": {
    "speciesId": 475,
    "evioliteEligible": false
  },
  "10069": {
    "speciesId": 531,
    "evioliteEligible": false
  },
  "10070": {
    "speciesId": 319,
    "evioliteEligible": false
  },
  "10071": {
    "speciesId": 80,
    "evioliteEligible": false
  },
  "10072": {
    "speciesId": 208,
    "evioliteEligible": false
  },
  "10073": {
    "speciesId": 18,
    "evioliteEligible": false
  },
  "10074": {
    "speciesId": 362,
    "evioliteEligible": false
  },
  "10075": {
    "speciesId": 719,
    "evioliteEligible": false
  },
  "10076": {
    "speciesId": 376,
    "evioliteEligible": false
  },
  "10077": {
    "speciesId": 382,
    "evioliteEligible": false
  },
  "10078": {
    "speciesId": 383,
    "evioliteEligible": false
  },
  "10079": {
    "speciesId": 384,
    "evioliteEligible": false
  },
  "10080": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10081": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10082": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10083": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10084": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10085": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10086": {
    "speciesId": 720,
    "evioliteEligible": false
  },
  "10087": {
    "speciesId": 323,
    "evioliteEligible": false
  },
  "10088": {
    "speciesId": 428,
    "evioliteEligible": false
  },
  "10089": {
    "speciesId": 373,
    "evioliteEligible": false
  },
  "10090": {
    "speciesId": 15,
    "evioliteEligible": false
  },
  "10091": {
    "speciesId": 19,
    "evioliteEligible": true
  },
  "10092": {
    "speciesId": 20,
    "evioliteEligible": false
  },
  "10093": {
    "speciesId": 20,
    "evioliteEligible": false
  },
  "10094": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10095": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10096": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10097": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10098": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10099": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10100": {
    "speciesId": 26,
    "evioliteEligible": false
  },
  "10101": {
    "speciesId": 27,
    "evioliteEligible": true
  },
  "10102": {
    "speciesId": 28,
    "evioliteEligible": false
  },
  "10103": {
    "speciesId": 37,
    "evioliteEligible": true
  },
  "10104": {
    "speciesId": 38,
    "evioliteEligible": false
  },
  "10105": {
    "speciesId": 50,
    "evioliteEligible": true
  },
  "10106": {
    "speciesId": 51,
    "evioliteEligible": false
  },
  "10107": {
    "speciesId": 52,
    "evioliteEligible": true
  },
  "10108": {
    "speciesId": 53,
    "evioliteEligible": false
  },
  "10109": {
    "speciesId": 74,
    "evioliteEligible": true
  },
  "10110": {
    "speciesId": 75,
    "evioliteEligible": true
  },
  "10111": {
    "speciesId": 76,
    "evioliteEligible": false
  },
  "10112": {
    "speciesId": 88,
    "evioliteEligible": true
  },
  "10113": {
    "speciesId": 89,
    "evioliteEligible": false
  },
  "10114": {
    "speciesId": 103,
    "evioliteEligible": false
  },
  "10115": {
    "speciesId": 105,
    "evioliteEligible": false
  },
  "10116": {
    "speciesId": 658,
    "evioliteEligible": false
  },
  "10117": {
    "speciesId": 658,
    "evioliteEligible": false
  },
  "10118": {
    "speciesId": 718,
    "evioliteEligible": false
  },
  "10119": {
    "speciesId": 718,
    "evioliteEligible": false
  },
  "10120": {
    "speciesId": 718,
    "evioliteEligible": false
  },
  "10121": {
    "speciesId": 735,
    "evioliteEligible": false
  },
  "10122": {
    "speciesId": 738,
    "evioliteEligible": false
  },
  "10123": {
    "speciesId": 741,
    "evioliteEligible": false
  },
  "10124": {
    "speciesId": 741,
    "evioliteEligible": false
  },
  "10125": {
    "speciesId": 741,
    "evioliteEligible": false
  },
  "10126": {
    "speciesId": 745,
    "evioliteEligible": false
  },
  "10127": {
    "speciesId": 746,
    "evioliteEligible": false
  },
  "10128": {
    "speciesId": 754,
    "evioliteEligible": false
  },
  "10129": {
    "speciesId": 758,
    "evioliteEligible": false
  },
  "10130": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10131": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10132": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10133": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10134": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10135": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10136": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10137": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10138": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10139": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10140": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10141": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10142": {
    "speciesId": 774,
    "evioliteEligible": false
  },
  "10143": {
    "speciesId": 778,
    "evioliteEligible": false
  },
  "10144": {
    "speciesId": 778,
    "evioliteEligible": false
  },
  "10145": {
    "speciesId": 778,
    "evioliteEligible": false
  },
  "10146": {
    "speciesId": 784,
    "evioliteEligible": false
  },
  "10147": {
    "speciesId": 801,
    "evioliteEligible": false
  },
  "10148": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10149": {
    "speciesId": 105,
    "evioliteEligible": false
  },
  "10150": {
    "speciesId": 743,
    "evioliteEligible": false
  },
  "10151": {
    "speciesId": 744,
    "evioliteEligible": false
  },
  "10152": {
    "speciesId": 745,
    "evioliteEligible": false
  },
  "10153": {
    "speciesId": 752,
    "evioliteEligible": false
  },
  "10154": {
    "speciesId": 777,
    "evioliteEligible": false
  },
  "10155": {
    "speciesId": 800,
    "evioliteEligible": false
  },
  "10156": {
    "speciesId": 800,
    "evioliteEligible": false
  },
  "10157": {
    "speciesId": 800,
    "evioliteEligible": false
  },
  "10158": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10159": {
    "speciesId": 133,
    "evioliteEligible": false
  },
  "10160": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10161": {
    "speciesId": 52,
    "evioliteEligible": true
  },
  "10162": {
    "speciesId": 77,
    "evioliteEligible": true
  },
  "10163": {
    "speciesId": 78,
    "evioliteEligible": false
  },
  "10164": {
    "speciesId": 79,
    "evioliteEligible": true
  },
  "10165": {
    "speciesId": 80,
    "evioliteEligible": false
  },
  "10166": {
    "speciesId": 83,
    "evioliteEligible": true
  },
  "10167": {
    "speciesId": 110,
    "evioliteEligible": false
  },
  "10168": {
    "speciesId": 122,
    "evioliteEligible": true
  },
  "10169": {
    "speciesId": 144,
    "evioliteEligible": false
  },
  "10170": {
    "speciesId": 145,
    "evioliteEligible": false
  },
  "10171": {
    "speciesId": 146,
    "evioliteEligible": false
  },
  "10172": {
    "speciesId": 199,
    "evioliteEligible": false
  },
  "10173": {
    "speciesId": 222,
    "evioliteEligible": true
  },
  "10174": {
    "speciesId": 263,
    "evioliteEligible": true
  },
  "10175": {
    "speciesId": 264,
    "evioliteEligible": true
  },
  "10176": {
    "speciesId": 554,
    "evioliteEligible": true
  },
  "10177": {
    "speciesId": 555,
    "evioliteEligible": false
  },
  "10178": {
    "speciesId": 555,
    "evioliteEligible": false
  },
  "10179": {
    "speciesId": 562,
    "evioliteEligible": true
  },
  "10180": {
    "speciesId": 618,
    "evioliteEligible": false
  },
  "10181": {
    "speciesId": 718,
    "evioliteEligible": false
  },
  "10182": {
    "speciesId": 845,
    "evioliteEligible": false
  },
  "10183": {
    "speciesId": 845,
    "evioliteEligible": false
  },
  "10184": {
    "speciesId": 849,
    "evioliteEligible": false
  },
  "10185": {
    "speciesId": 875,
    "evioliteEligible": false
  },
  "10186": {
    "speciesId": 876,
    "evioliteEligible": false
  },
  "10187": {
    "speciesId": 877,
    "evioliteEligible": false
  },
  "10188": {
    "speciesId": 888,
    "evioliteEligible": false
  },
  "10189": {
    "speciesId": 889,
    "evioliteEligible": false
  },
  "10190": {
    "speciesId": 890,
    "evioliteEligible": false
  },
  "10191": {
    "speciesId": 892,
    "evioliteEligible": false
  },
  "10192": {
    "speciesId": 893,
    "evioliteEligible": false
  },
  "10193": {
    "speciesId": 898,
    "evioliteEligible": false
  },
  "10194": {
    "speciesId": 898,
    "evioliteEligible": false
  },
  "10195": {
    "speciesId": 3,
    "evioliteEligible": false
  },
  "10196": {
    "speciesId": 6,
    "evioliteEligible": false
  },
  "10197": {
    "speciesId": 9,
    "evioliteEligible": false
  },
  "10198": {
    "speciesId": 12,
    "evioliteEligible": false
  },
  "10199": {
    "speciesId": 25,
    "evioliteEligible": false
  },
  "10200": {
    "speciesId": 52,
    "evioliteEligible": false
  },
  "10201": {
    "speciesId": 68,
    "evioliteEligible": false
  },
  "10202": {
    "speciesId": 94,
    "evioliteEligible": false
  },
  "10203": {
    "speciesId": 99,
    "evioliteEligible": false
  },
  "10204": {
    "speciesId": 131,
    "evioliteEligible": false
  },
  "10205": {
    "speciesId": 133,
    "evioliteEligible": false
  },
  "10206": {
    "speciesId": 143,
    "evioliteEligible": false
  },
  "10207": {
    "speciesId": 569,
    "evioliteEligible": false
  },
  "10208": {
    "speciesId": 809,
    "evioliteEligible": false
  },
  "10209": {
    "speciesId": 812,
    "evioliteEligible": false
  },
  "10210": {
    "speciesId": 815,
    "evioliteEligible": false
  },
  "10211": {
    "speciesId": 818,
    "evioliteEligible": false
  },
  "10212": {
    "speciesId": 823,
    "evioliteEligible": false
  },
  "10213": {
    "speciesId": 826,
    "evioliteEligible": false
  },
  "10214": {
    "speciesId": 834,
    "evioliteEligible": false
  },
  "10215": {
    "speciesId": 839,
    "evioliteEligible": false
  },
  "10216": {
    "speciesId": 841,
    "evioliteEligible": false
  },
  "10217": {
    "speciesId": 842,
    "evioliteEligible": false
  },
  "10218": {
    "speciesId": 844,
    "evioliteEligible": false
  },
  "10219": {
    "speciesId": 849,
    "evioliteEligible": false
  },
  "10220": {
    "speciesId": 851,
    "evioliteEligible": false
  },
  "10221": {
    "speciesId": 858,
    "evioliteEligible": false
  },
  "10222": {
    "speciesId": 861,
    "evioliteEligible": false
  },
  "10223": {
    "speciesId": 869,
    "evioliteEligible": false
  },
  "10224": {
    "speciesId": 879,
    "evioliteEligible": false
  },
  "10225": {
    "speciesId": 884,
    "evioliteEligible": false
  },
  "10226": {
    "speciesId": 892,
    "evioliteEligible": false
  },
  "10227": {
    "speciesId": 892,
    "evioliteEligible": false
  },
  "10228": {
    "speciesId": 849,
    "evioliteEligible": false
  },
  "10229": {
    "speciesId": 58,
    "evioliteEligible": true
  },
  "10230": {
    "speciesId": 59,
    "evioliteEligible": false
  },
  "10231": {
    "speciesId": 100,
    "evioliteEligible": true
  },
  "10232": {
    "speciesId": 101,
    "evioliteEligible": false
  },
  "10233": {
    "speciesId": 157,
    "evioliteEligible": false
  },
  "10234": {
    "speciesId": 211,
    "evioliteEligible": true
  },
  "10235": {
    "speciesId": 215,
    "evioliteEligible": true
  },
  "10236": {
    "speciesId": 503,
    "evioliteEligible": false
  },
  "10237": {
    "speciesId": 549,
    "evioliteEligible": false
  },
  "10238": {
    "speciesId": 570,
    "evioliteEligible": true
  },
  "10239": {
    "speciesId": 571,
    "evioliteEligible": false
  },
  "10240": {
    "speciesId": 628,
    "evioliteEligible": false
  },
  "10241": {
    "speciesId": 705,
    "evioliteEligible": true
  },
  "10242": {
    "speciesId": 706,
    "evioliteEligible": false
  },
  "10243": {
    "speciesId": 713,
    "evioliteEligible": false
  },
  "10244": {
    "speciesId": 724,
    "evioliteEligible": false
  },
  "10245": {
    "speciesId": 483,
    "evioliteEligible": false
  },
  "10246": {
    "speciesId": 484,
    "evioliteEligible": false
  },
  "10247": {
    "speciesId": 550,
    "evioliteEligible": true
  },
  "10248": {
    "speciesId": 902,
    "evioliteEligible": false
  },
  "10249": {
    "speciesId": 905,
    "evioliteEligible": false
  },
  "10250": {
    "speciesId": 128,
    "evioliteEligible": false
  },
  "10251": {
    "speciesId": 128,
    "evioliteEligible": false
  },
  "10252": {
    "speciesId": 128,
    "evioliteEligible": false
  },
  "10253": {
    "speciesId": 194,
    "evioliteEligible": true
  },
  "10254": {
    "speciesId": 916,
    "evioliteEligible": false
  },
  "10255": {
    "speciesId": 982,
    "evioliteEligible": false
  },
  "10256": {
    "speciesId": 964,
    "evioliteEligible": false
  },
  "10257": {
    "speciesId": 925,
    "evioliteEligible": false
  },
  "10258": {
    "speciesId": 978,
    "evioliteEligible": false
  },
  "10259": {
    "speciesId": 978,
    "evioliteEligible": false
  },
  "10260": {
    "speciesId": 931,
    "evioliteEligible": false
  },
  "10261": {
    "speciesId": 931,
    "evioliteEligible": false
  },
  "10262": {
    "speciesId": 931,
    "evioliteEligible": false
  },
  "10263": {
    "speciesId": 999,
    "evioliteEligible": true
  },
  "10264": {
    "speciesId": 1007,
    "evioliteEligible": false
  },
  "10265": {
    "speciesId": 1007,
    "evioliteEligible": false
  },
  "10266": {
    "speciesId": 1007,
    "evioliteEligible": false
  },
  "10267": {
    "speciesId": 1007,
    "evioliteEligible": false
  },
  "10268": {
    "speciesId": 1008,
    "evioliteEligible": false
  },
  "10269": {
    "speciesId": 1008,
    "evioliteEligible": false
  },
  "10270": {
    "speciesId": 1008,
    "evioliteEligible": false
  },
  "10271": {
    "speciesId": 1008,
    "evioliteEligible": false
  },
  "10272": {
    "speciesId": 901,
    "evioliteEligible": false
  },
  "10273": {
    "speciesId": 1017,
    "evioliteEligible": false
  },
  "10274": {
    "speciesId": 1017,
    "evioliteEligible": false
  },
  "10275": {
    "speciesId": 1017,
    "evioliteEligible": false
  },
  "10276": {
    "speciesId": 1024,
    "evioliteEligible": false
  },
  "10277": {
    "speciesId": 1024,
    "evioliteEligible": false
  },
  "10278": {
    "speciesId": 36,
    "evioliteEligible": false
  },
  "10279": {
    "speciesId": 71,
    "evioliteEligible": false
  },
  "10280": {
    "speciesId": 121,
    "evioliteEligible": false
  },
  "10281": {
    "speciesId": 149,
    "evioliteEligible": false
  },
  "10282": {
    "speciesId": 154,
    "evioliteEligible": false
  },
  "10283": {
    "speciesId": 160,
    "evioliteEligible": false
  },
  "10284": {
    "speciesId": 227,
    "evioliteEligible": false
  },
  "10285": {
    "speciesId": 478,
    "evioliteEligible": false
  },
  "10286": {
    "speciesId": 500,
    "evioliteEligible": false
  },
  "10287": {
    "speciesId": 530,
    "evioliteEligible": false
  },
  "10288": {
    "speciesId": 545,
    "evioliteEligible": false
  },
  "10289": {
    "speciesId": 560,
    "evioliteEligible": false
  },
  "10290": {
    "speciesId": 604,
    "evioliteEligible": false
  },
  "10291": {
    "speciesId": 609,
    "evioliteEligible": false
  },
  "10292": {
    "speciesId": 652,
    "evioliteEligible": false
  },
  "10293": {
    "speciesId": 655,
    "evioliteEligible": false
  },
  "10294": {
    "speciesId": 658,
    "evioliteEligible": false
  },
  "10295": {
    "speciesId": 668,
    "evioliteEligible": false
  },
  "10296": {
    "speciesId": 670,
    "evioliteEligible": false
  },
  "10297": {
    "speciesId": 687,
    "evioliteEligible": false
  },
  "10298": {
    "speciesId": 689,
    "evioliteEligible": false
  },
  "10299": {
    "speciesId": 691,
    "evioliteEligible": false
  },
  "10300": {
    "speciesId": 701,
    "evioliteEligible": false
  },
  "10301": {
    "speciesId": 718,
    "evioliteEligible": false
  },
  "10302": {
    "speciesId": 780,
    "evioliteEligible": false
  },
  "10303": {
    "speciesId": 870,
    "evioliteEligible": false
  },
  "10304": {
    "speciesId": 26,
    "evioliteEligible": false
  },
  "10305": {
    "speciesId": 26,
    "evioliteEligible": false
  },
  "10306": {
    "speciesId": 358,
    "evioliteEligible": false
  },
  "10307": {
    "speciesId": 359,
    "evioliteEligible": false
  },
  "10308": {
    "speciesId": 398,
    "evioliteEligible": false
  },
  "10309": {
    "speciesId": 445,
    "evioliteEligible": false
  },
  "10310": {
    "speciesId": 448,
    "evioliteEligible": false
  },
  "10311": {
    "speciesId": 485,
    "evioliteEligible": false
  },
  "10312": {
    "speciesId": 491,
    "evioliteEligible": false
  },
  "10313": {
    "speciesId": 623,
    "evioliteEligible": false
  },
  "10314": {
    "speciesId": 678,
    "evioliteEligible": false
  },
  "10315": {
    "speciesId": 740,
    "evioliteEligible": false
  },
  "10316": {
    "speciesId": 768,
    "evioliteEligible": false
  },
  "10317": {
    "speciesId": 801,
    "evioliteEligible": false
  },
  "10318": {
    "speciesId": 801,
    "evioliteEligible": false
  },
  "10319": {
    "speciesId": 807,
    "evioliteEligible": false
  },
  "10320": {
    "speciesId": 952,
    "evioliteEligible": false
  },
  "10321": {
    "speciesId": 970,
    "evioliteEligible": false
  },
  "10322": {
    "speciesId": 978,
    "evioliteEligible": false
  },
  "10323": {
    "speciesId": 978,
    "evioliteEligible": false
  },
  "10324": {
    "speciesId": 978,
    "evioliteEligible": false
  },
  "10325": {
    "speciesId": 998,
    "evioliteEligible": false
  }
} satisfies Record<UpstreamResourceId, PokemonLite>

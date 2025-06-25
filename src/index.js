import { getJSON, copyText } from "./utill.js";
import { drawDataTable } from "./drawTable.js";
import { Config } from "./config.js";

let CUSTOM_DATA = [];
let VEHICLE_DATA = [];
let CHARACTER_DATA = [];

await init();

async function init() {
    //データの読み込み、初期化
    VEHICLE_DATA = await getJSON("../data/vehicle.json");
    CHARACTER_DATA = await getJSON("../data/character.json");
    try {
        CUSTOM_DATA = JSON.parse(localStorage.getItem("data_" + Config.DATA_VERSION));
    } catch {
        CUSTOM_DATA = [];
    }
    if (CUSTOM_DATA == null) {
        CUSTOM_DATA = [];
        CHARACTER_DATA.forEach(char => {
            VEHICLE_DATA.forEach(vehicle => {
                CUSTOM_DATA.push({
                    "Char": char.Name,
                    "Char_JP": char.Name_JP,
                    "Vehicle": vehicle.Name,
                    "Vehicle_JP": vehicle.Name_JP,
                    "Road": char.Road + vehicle.Road,
                    "Terrain": char.Terrain + vehicle.Terrain,
                    "Water": char.Water + vehicle.Water,
                    "Unknown": char.Unknown + vehicle.Unknown,
                    "Accel": char.Accel + vehicle.Accel,
                    "Weight": char.Weight + vehicle.Weight,
                    "Handling": char.Handling + vehicle.Handling,
                    "scoreRoad": char.Road + vehicle.Road,
                    "scoreTerrain": char.Terrain + vehicle.Terrain,
                    "scoreWater": char.Water + vehicle.Water,
                    "scoreUnknown": char.Unknown + vehicle.Unknown,
                    "scoreAccel": char.Accel + vehicle.Accel,
                    "scoreWeight": char.Weight + vehicle.Weight,
                    "scoreHandling": char.Handling + vehicle.Handling,
                    "sum": 50,
                });
            })
        })
        localStorage.setItem("data_" + Config.DATA_VERSION, JSON.stringify(CUSTOM_DATA));
    }

    //検索画面の生成
    //キャラクターセレクトの生成
    let target_select = $("#select_character");
    target_select.append($("<option>"));
    CHARACTER_DATA.forEach(char => {
        let option = $("<option>").val(char.Name).text(char.Name_JP);
        target_select.append(option);
    })

    //GETパラメータを取得
    let params = new URL(window.location.href).searchParams;

    //GETパラメータから値を設定
    $("input").each(function () {
        let val = params.get($(this).attr("name"));
        if (val !== null && val !== undefined) {
            $('input[name="' + $(this).attr("name") + '"]').val(val);

        }
    })

    $("select").each(function () {
        let val = params.get($(this).attr("name"));
        if (val !== null && val !== undefined) {
            $('select[name="' + $(this).attr("name") + '"]').val(val);
        }
    })

    //スライダーの値表示設定
    $("input[type=range]").change(function () {
        $(this).next("label").text(parseFloat($(this).val()).toFixed(1) + "倍")
    })
    rangeInputReflection();

    $("#submit").click(function () {
        search();
    })
}

/**
 * 検索ボタン押下
 */
function search() {
    let character = $('select[name="character"]').val();
    let roadWeight = parseFloat($('#range_road').val());
    let terrainWeight = parseFloat($('#range_terrain').val());
    let waterWeight = parseFloat($('#range_water').val());
    let accelWeight = parseFloat($('#range_accel').val());
    let weightWeight = parseFloat($('#range_weight').val());
    let handlingWeight = parseFloat($('#range_handling').val());
    let result = [];

    if (character !== "") {
        result = CUSTOM_DATA.filter(line => line.Char == character);
    } else {
        result = CUSTOM_DATA;
    }
    result.forEach(element => {
        let sum = 0;
        sum += element.scoreRoad = element.Road * roadWeight;
        sum += element.scoreTerrain = element.Terrain * terrainWeight;
        sum += element.scoreWater = element.Water * waterWeight;
        sum += element.scoreAccel = element.Accel * accelWeight;
        sum += element.scoreWeight = element.Weight * weightWeight;
        sum += element.scoreHandling = element.Handling * handlingWeight;
        element.sum = sum;
    });
    result.sort(function (a, b) {
        return (b.sum - a.sum);
    });
    drawDataTable($(".result"), result.slice(0, 100), Config.DISPLAY_COLUMNS);
    let UrlCopyButton = $("<button>").addClass("url_copy_button").attr("id","url_copy_button").data("url",window.location.href).text("コピー");
    $(".result").before(UrlCopyButton);
    copyText("#url_copy_button");
}

/** rangeの値をラベルに反映する */
function rangeInputReflection() {
    $("input[type=range]").each(function () {
        $(this).next("label").text(parseFloat($(this).val()).toFixed(1) + "倍")
    })
}
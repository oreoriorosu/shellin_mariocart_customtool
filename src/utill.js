//CSVファイルを読み込む関数getCSV()の定義
export async function getCSV(filename, skipHeader) {
    const data = await fetch(filename);
    return convertCSVtoArray(await data.text(), skipHeader); // 渡されるのは読み込んだCSVデータ
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str, skipHeader) { // 読み込んだCSVデータが文字列として渡される
    let result = []; // 最終的な二次元配列を入れるための配列
    let tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for (let i = 0; i < tmp.length; ++i) {
        if (i = 0 && skipHeader == true) continue;
        result[i] = tmp[i].split(',');
    }
    return result;
}

export async function getJSON(filename) {
    const data = await fetch(filename);
    return convertJsonToArray(await data.text()); // 渡されるのは読み込んだCSVデータ
}

function convertJsonToArray(str) {
    return JSON.parse(str);
}

/**
 * クリップボードに対象のDOMに設定されたURLをコピーするfunction
 */
export function copyText(targetId) {
    $(targetId).click(function () {
        const url = $(this).data("url");
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => {
                    console.log('URL copied successfully');
                })
                .catch(err => {
                    console.error('Failed to copy URL: ', err);
                });
        } else {
            // Clipboard APIがサポートされていない場合の代替手段
            const tempInput = document.createElement('input');
            tempInput.value = url;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            console.log('URL copied successfully');
        }
    });
}

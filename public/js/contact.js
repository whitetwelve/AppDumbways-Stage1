function getData() {

    let nama = document.getElementById('name').value
    let email = document.getElementById('email').value
    let nohp = document.getElementById('nohp').value
    let sbj = document.getElementById('sbj').value
    let msg = document.getElementById('msg').value

    // clear data 
    document.getElementById('name').value = ""
    document.getElementById('email').value = ""
    document.getElementById('nohp').value = ""
    document.getElementById('sbj').value = ""
    document.getElementById('msg').value = ""

    // penkondisian validasi
    if (nama == "" || email == "" || nohp == "" || sbj == "" || msg == "") {
        return alert("Silahkan lengkapi data anda terlebih dahulu ..");
    } else if (nama == nama.value) {
        alert("Your data being processed");
    }
    let e = 'aaa@yahoo.com';

    let app = `mailto:${e}?subject=${sbj}&body=Selamat Pagi, Perkenalkan nama saya ${nama} ${sbj},silahkan hubungi kembali ke nomor ${nohp}.`
    window.location.href = app;
}
// Object
// let Obj = {
//     nama,
//     gender,
//     tgl,
//     nohp,
//     pend,
//     about
// }
// console.table(Obj)
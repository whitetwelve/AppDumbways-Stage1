const month = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
]

let blogss = [];

function addData(event) {

    event.preventDefault();
    let projectName = document.getElementById('pn').value;
    let date = {
        startDate: document.querySelector('#str').value,
        endDate: document.querySelector('#end').value
    }
    let description = document.getElementById('desc').value;
    let upload = document.getElementById('upload')
    let checkbox = {
        nodeJs: document.querySelector('#node').checked,
        nextJs: document.querySelector('#next').checked,
        reactJs: document.querySelector('#react').checked,
        typeScript: document.querySelector('#type').checked
    }
    upload = URL.createObjectURL(upload.files[0])

    let blog = {
        projectName,
        date,
        description,
        upload,
        checkbox
    }


    blogss.push(blog)
        // console.log(blogss)

    //     console.table(blogss)
    //     console.log(`Panjang Array : ${blogss.length}`)
    // let testInnerHTML = document.getElementById('a');

    // testInnerHTML.innerHTML = 
    // `<h1>${blog.projectName}</h1>
    // <p>${blog.desc}</p>
    // <img src="${blog.upload}">`
    console.log(blogss);
    render();

}

function render() {


    const container = document.getElementById("contents")
    container.innerHTML = firstBlogContent();

    // Convert object blog to string
    // const ObjectBlogsString = JSON.stringify(blogss);
    for (let i = 0; i < blogss.length; i++) {

        const dateStart = new Date(blogss[i].date.startDate)
        const dateEnd = new Date(blogss[i].date.endDate)
        let monthIndex = dateEnd.getMonth();
        let year = dateEnd.getFullYear();
        let hour = dateEnd.getHours();
        let minute = dateEnd.getMinutes();
        let duration = getDistanceTime(dateStart, dateEnd)

        // localStorage.setItem(`${blogss[i].projectName}`, ObjectBlogsString);
        container.innerHTML +=
            `<div id="contents" class="project-list">
            <div class="my-project">
                <div class="card shadow-lg mb-4" style="width: 26rem;">
                    <img class="card-img-top" src="${blogss[i].upload}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title" ; style=" margin-left: 10px;"><a href="#" onclick="projectDetail(event)"  style="color:black" >${blogss[i].projectName} -  ${year}</a> </h5>
                        <small style="color: rgb(134, 130, 130); margin-left: 10px; ">durasi : ${duration}</small>
                        <br>
                        <p class="card-text ">${blogss[i].description}
                        </p>
                        <div class="logo ">
                        ${(blogss[i].checkbox.nodeJs === true) ? `<i class="fa-brands fa-node fa-2x "></i>`:``}
                        ${(blogss[i].checkbox.reactJs === true) ? `<i class="fa-brands fa-react fa-2x "></i>`:``}
                        ${(blogss[i].checkbox.nextJs === true) ? `<img src="img/nextjs.png" alt="nextJs">`:``}
                        ${(blogss[i].checkbox.typeScript === true) ? `<img src="img/typescript.png" alt="typescript">`:``}
                        </div>
                        <div class="btn ">
                            &nbsp;&nbsp;<button href="#edites" class="btn btn-dark" style="width: 170px;" id="edit">Edit</button>
                            <button href="#deletes "class="btn btn-dark" style="width: 170px;" id="delete">Delete</button>
                        </div>

                    </div>
                </div>
            </div>
            </div>`;
    }
}

function projectDetail(event) {
    // Item Name in Local Storage
    let keyName;
    if (event) {
        keyName = event.path[0].id;
        const contentBodyElement = document.querySelector('.content-body');
        const data = JSON.parse(localStorage.getItem(keyName));
        for (let i = 0; i < data.length; i++) {
            const endDate = new Date(blogss[i].date.endDate);
            const dateEnd = endDate.getDate();
            const monthIndexEnd = endDate.getMonth();
            const yearEnd = endDate.getFullYear();
            const hourEnd = endDate.getHours();
            let minuteEnd = endDate.getMinutes();

            const startDate = new Date(blogss[i].date.startDate);
            const dateStart = startDate.getDate();
            const monthIndexStart = startDate.getMonth();
            const yearStart = startDate.getFullYear();
            const hourStart = startDate.getHours();
            let minuteStart = startDate.getMinutes();
            // contentBodyElement.textContent = '';
            const calculate = getDistanceTime(startDate, endDate);
            contentBodyElement.innerHTML += `
        <div class="content-title">
            <h1>${data[i].projectName}</h1>
        </div>
        <div class="container-content">
            <div class="content-card-top">
                <div class="project-image">
                    <img src="${data[i].upload}" alt="Content Image">
                </div>
                <div class="project-about">
                    <div class="project-duration">
                        <h2>Duration</h2>
                        <i class="fa-solid fa-calendar-days fa-xl"></i><small>${dateStart} ${month[monthIndexStart]} ${yearStart} - ${dateEnd} ${month[monthIndexEnd]} ${yearEnd}</small><br>
                        <i class="fa-solid fa-clock fa-xl"></i><small>${calculate}</small>
                    </div>
                    <div class="project-technologies">
                        <h2>Technologies</h2>
                        <div class="technology-icons">
                        <div class="left-icons">
                        ${(data[i].checkbox.nodeJs === true) ? '<img src="img/node-js-brands.svg" id="nodeJsIcon" alt="nodeJsIcon" style="width:40px ;">' : ''}<br>
                        ${(data[i].checkbox.reactJs === true) ? '<img src="img/reactjs.jpg" id="reactJsIcon" alt="reactJsIcon" style="width:50px ;">' : ''}
                    </div>
                    <div class="left-text">
                    ${(data[i].checkbox.nodeJs=== true) ? ' <p style="margin-top:5px ;">Node Js</p>':'' }
                        <br>
                        ${(data[i].checkbox.reactJs=== true) ? ' <p style="margin-top:5px ;">React Js</>':'' }
                        
                    </div>
                    <div class="right-icons">
                    ${(data[i].checkbox.nextJs === true) ? '<img style="width: 40px;" src="img/nextjs.png" id="nextJsIcon" alt="nextJsIcon">' : ''}<br>
                    <div class="right-icons">
                    ${(data[i].checkbox.typeScript === true) ? '<img style="width: 40px;" src="img/typescript.png" id="typeScriptIcon" alt="typeScriptIcon">' : ''}
                    </div>
                    <div class="right-text">
                    ${(data[i].checkbox.nextJs === true) ? '<p>Next Js</p>' : ''}<br>
                    ${(data[i].checkbox.typeScript === true) ? '<p>TypeScript</p>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-card-buttom">
                <div class="content-description">
                    <p>${data[i].description}</p>
                </div>
            </div>
        </div>
        `;
        }
    }


}

function getFullTime(time) {

    const date = time.getDate();
    const monthIndex = time.getMonth();
    const year = time.getFullYear();

    let hour = time.getHours();
    let minute = time.getMinutes();

    if (minute < 10) {
        minute = '0' + minute
    };

    if (hour < 10) {
        hour = '0' + hour
    };

    return `${date} ${month[monthIndex]} ${year} ${hour} :${minute}WIB`
}

function getDistanceTime(time,time2) {
    // console.log(typeof time);
    const final = (time2 - time)
        //convert to day
    const miliseconds = 1000
    const secondInMinute = 60
    const minuteInHour = 60
    const secondInHour = secondInMinute * minuteInHour // 3600
    const hourInDay = 23
    const dayInMonth = 30
    let hourDistance = Math.floor(final / (miliseconds * secondInHour))
    
    let monthDistance = final / (miliseconds * secondInHour * hourInDay * dayInMonth);

    if (monthDistance >= 1){
        const time = Math.floor(monthDistance) + ' months ago'
     return time
    } else { 
        let dayDistance = Math.floor(final / (1000 * 3600 * 23))
        if (dayDistance >=1 ){
            return dayDistance + ' days ago'
        } else {
            let hourDistance = Math.floor(final / (1000 * 3600 * 23))
            if (hourDistance >=1 ){
                return hourDistance + ' hours ago'
            } else {
                let minuteDistance = Math.floor(final / (miliseconds * secondInMinute))
                if(minuteDistance >= 0){
                return minuteDistance + ' minutes ago'
            // } else {
            //     let secondDistance = Math.floor(final / (miliseconds))
            //     if(secondDistance >= 0){
            //     return secondDistance + ' seconds ago'
            // }
        }
    }
        }
    // let startDate= new Date("02/12/2022");
    // let endDate = new Date("07/10/2022");

    // let waktuPengerjaan = endDate.getTime() - startDate.getTime();


    //     }
    //   }
    // }
    // setInterval(function () {
    //     render()
    //   }, 1000)
    
        }
}
setTimeout(() => {
    alert('Welcome Fuad Azkia!')
}, 1000);


function firstBlogContent() {
    return `
    <!-- Blog list -->
            <div id="contents" class="project-list">
                <div class="my-project">
                    <div class="card shadow-lg mb-4" style="width: 26rem;">
                        <img class="card-img-top" src="https://media.istockphoto.com/photos/global-connection-picture-id1335295270?s=612x612" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title" ; style=" margin-left: 10px; text-decoration: none;"><a href="detail-project1.html" onclick="projectDetail(event)" style="color:black">Dumbways Mobile App - 2021</a></h5>
                            <small style="color: rgb(134, 130, 130); margin-left: 10px; ">durasi : 3 bulan</small>
                            <br>
                            <p class="card-text ">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum fuga accusamus iste nesciunt beatae molestias. Perspiciatis voluptate beatae obcaecati reprehenderit.
                            </p>
                            <div class="logo ">
                                <i class="fa-brands fa-node fa-2x "></i>
                                <i class="fa-brands fa-react fa-2x "></i>
                                <img src="img/nextjs.png" alt="nextJs">
                                <img src="img/typescript.png" alt="typescript">
                            </div>
                            <div class="btn ">
                                &nbsp;&nbsp;<button href="#edites " class="btn btn-dark " style="width: 170px;" id="edit">Edit</button>
                                <button href="#deletes " class="btn btn-dark " style="width: 170px;" id="delete">Delete</button>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="my-project">
                    <div class="card shadow-lg mb-4" style="width: 26rem;">
                        <img class="card-img-top" src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title" ; style=" margin-left: 10px;"><a href="detail-project2.html" style="color:black; text-decoration: none;">Dumbways Mobile App - 2021</a></h5>
                            </h5>
                            <small style="color: rgb(134, 130, 130); margin-left: 10px; ">durasi : 3 bulan</small>
                            <br>
                            <p class="card-text ">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum fuga accusamus iste nesciunt beatae molestias. Perspiciatis voluptate beatae obcaecati reprehenderit.
                            </p>
                            <div class="logo ">
                                <i class="fa-brands fa-node fa-2x "></i>
                                <i class="fa-brands fa-react fa-2x "></i>
                                <img src="img/nextjs.png" alt="nextJs">
                                <img src="img/typescript.png" alt="typescript">
                            </div>
                            <div class="btn ">
                                &nbsp;&nbsp;<button href="#edites " class="btn btn-dark " style="width: 170px;" id="edit">Edit</button>
                                <button href="#deletes " class="btn btn-dark " style="width: 170px;" id="delete">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`}

// window.onbeforeunload = function () {
//     return 'If you reload, refresh, redirect, and close. data will be removed!';
// }

function removeStorageItem() {
    // Dapatkan performance entries data
    const perfEntries = performance.getEntriesByType("navigation");

    // Looping performance entries data
    for (let i = 0; i < perfEntries.length; i++) {
        // Dapatkan performance entries data
        let p = perfEntries[i];
        // Cek jika tipe data entrynya reload
        if (p.type === 'reload') {
            // Hapus data sementaranya
            for (let index = 0; index < localStorage.length; index++) {
                const keyName = localStorage.key(index);
                localStorage.removeItem(keyName);
            }
        }

    }
}

removeStorageItem();
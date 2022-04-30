let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".memus button");
menus.forEach((menu) =>
    menu.addEventListener("click", (event) => getNewsByTopic(event))
);
let searchButton = document.getElementById("search-button");
let url;

// <코드 리펙토링>
// 각함수에서 필요한 url을 만든다
// api 호출함수를 부른다

const getNews = async () => {
    try {
        let header = new Headers({
            "x-api-key": "op376wa5UOFHU8xA-JvoLvPz_-_fCSnoGi9l6jksb9c",
        });
        url.searchParams.set('page',page); //&page 값을 쿼리에 추가하기 
        console.log(url, "url이래")
        let response = await fetch(url,{ headers: header }); // ajax, fetch , http
        let data = await response.json();
        if (response.status == 200) {
            if (data.total_hits == 0){
                throw new Error("검색된 결과값이 없습니다.")
            }
            console.log("받는 데이터가 뭐지?" , data)
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            console.log(news);
            
            render();
            pagenation();
            

        } else {
            throw new Error(data.message)
        }
        console.log("this is data", data);

        console.log("response는", response);
        console.log("data는", data);


    } catch (error) {
        console.log("잡힌에러는", error.message)
        errorREnder(error.message)
    }
};
const getLastestNews = async () => {
    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
    );
    console.log(url);
    getNews();
};

const getNewsByTopic = async (event) => {
    console.log("클릭됨", event.target.textContent);
    let topic = event.target.textContent.toLowerCase();

    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
    );
    getNews();
};

const getNewsByKeyword = async () => {
    //1. 검색키워드 긁어오기
    //2. url에 검색키워드 붙이기
    //3. 헤더 준비
    //4. url 부르기
    //5. 데이터 가져오기
    //6. 데이터 랜더링
    let keyWord = document.getElementById("search-box").value;
    url = new URL(
        `https://api.newscatcherapi.com/v2/search?q=${keyWord}&page_size=10`
    );
    getNews();
};

const render = () => {
    let newsHTML = "";
    newsHTML = news
        .map((item) => {
            return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-image-size" src="${item.media}"/>

        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
                ${item.summary}
            </p>
            <div>
                ${item.rights}
                ${item.published_date}
            </div>

        </div>
    </div>`;
        })
        .join("");

    document.getElementById("news-board").innerHTML = newsHTML;
};

const errorREnder = (message) => {
    let errorHTML = `<div class="alert alert-warning text-center" role="alert">
    ${message}
  </div>`
    document.getElementById("news-board").innerHTML = errorHTML;

}

const pagenation = () => {
    let pagenationHTML = ``
    //total page
    // page
    // page group
    let pageGroup = Math.ceil(page/5)
    // last
    let last = pageGroup*5
    // first
    if (last > total_pages){
        last = total_pages
    }
    let first = last -4 <= 0 ? 1 : last - 4
    if (first >= 6 ){
        pagenationHTML = `<li class="page-item" onclick="moveTopage(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="moveTopage(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
    }
    // first ~ last 페이지 프린트

    //totalpage가 3일경우 3개의 페이지만 프린트하는거
    //<< >> 이버튼 만들어주기 만들고, 그것이 맨 처음, 마지막으로 이동하게끔 만들기
    // 내가 그룹1일때 << < 이버튼이 없고 마지막 그룹일때 >> > 이 버튼 없음

    for(let i= first; i<=last; i++){
        pagenationHTML += `<li class="page-item ${page == i? "active": ""}"><a class="page-link" href="#" onclick = "moveTopage(${i})">${i}</a></li>`
                                                // 삼항연산자 이용해서 현재 페이지 표시해주기

    }
    if (last <total_pages) {
        pagenationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick = "moveTopage(${page+1})">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>
  <li class="page-item" onclick="moveTopage(${total_pages})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`
    }
    


    document.querySelector(".pagination").innerHTML = pagenationHTML;
}

const moveTopage = (pageNum) => {
    //1. 이동하고 싶은 페이지 알고
    page = pageNum
    //2. 이동하고 싶은 페이지를 가지고 api 다시 호출
    getNews()
}
searchButton.addEventListener("click", getNewsByKeyword);
getLastestNews();

let news = [];
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

        let response = await fetch(url,{ headers: header }); // ajax, fetch , http
        let data = await response.json();
        if (response.status == 200) {
            if (data.total_hits == 0){
                throw new Error("검색된 결과값이 없습니다.")
            }
            news = data.articles;
            console.log(news);
            render();


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

searchButton.addEventListener("click", getNewsByKeyword);
getLastestNews();

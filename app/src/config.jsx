import exportCourse1 from "./images/ExportCourse1.png";
import exportCourse2 from "./images/ExportCourse2.png";
import exportCourse3 from "./images/ExportCourse3.png";
import exportCourse4 from "./images/ExportCourse4.png";
import exportCourse5 from "./images/ExportCourse5.png";
import exportCourse6 from "./images/ExportCourse6.png";
import exportCourse7 from "./images/ExportCourse7.png";

export const announcementData = {
    version: "v5.0.0 dev",
    feedbackFormUrl: "https://forms.gle/gFBZDgkSbj85zukP6",
    description: [
        <>
            此網站式依據電腦的使用者體驗設計，建議<span className="text-danger fw-bold">使用電腦瀏覽</span>，
            近期有在進行手機版的大幅度改善，歡迎提出意見。
        </>,
        <>
            這是輔助大家選課的系統，<span className="text-danger fw-bold">僅供參考</span>。
        </>,
        <>
            課程資料是爬蟲下來的靜態資料，若有校方<span
            className="text-danger fw-bold">有異動</span>，本人尚未更新的話<span
            className="text-danger fw-bold">請聯絡</span>，感謝。
        </>
    ],
    updates: [
        "新版前端完成了！",
        "一鍵登記與已選課程合併了",
        "優化課程動態渲染",
        "可以收起課表了",
    ],
    features: [
        "課表動態更新",
        "一鍵加入必修課",
        "更強大的篩選器以及智慧搜尋",
        "本學期學程搜尋",
        "顯示衝堂",
        "自動填課目前已經上線測試中！",
        "一鍵登記選課 (其實沒有一鍵啦)",
        "Local Storage 關閉瀏覽器自動儲存選課資料"
    ],
    knownIssues: [
        "等你回報",
    ],
    githubUrl: "https://github.com/whats2000/CourseSelectorHelperReact",
    contactEmail: "yochen0123@gmail.com",
    copyright: [
        "By Cellery Lin and whats2000. MEME113 ",
        "Copyright © 2023 Cellery Lin and whats2000. All rights reserved."
    ],
};

export const entryNotificationConfig = {
    version: announcementData.version,
    description: "中山選課小助手迎來第三學期囉~ 感謝您使用這個系統，也獲得不錯的流量。您寶貴的意見我們都有收到，並會改善更新，感謝各位支持與回饋了！",
    updates: announcementData.updates,
    feedbackFormUrl: announcementData.feedbackFormUrl,
};

export const courseData = {
    targetAPI: "https://api.github.com/repos/CelleryLin/selector_helper/contents/all_classes",
}

export const howToUseExportCode = [
    {
        image: exportCourse1,
        description: "選擇欲加選課程，並填入點數或志願 (請依照學校的規定勾選及填寫點數或志願，此以初選一配點為例)",
    },
    {
        image: exportCourse2,
        description: "點選匯出課程。",
    },
    {
        image: exportCourse3,
        description: "腳本一般會自動複製到剪貼簿，若沒有請手動複製。",
    },
    {
        image: exportCourse4,
        description: "進入選課系統，點選課 (這邊以初選一作範例)",
    },
    {
        image: exportCourse5,
        description: "右鍵點選空白處，選擇檢查。或是按下 F12。",
    },
    {
        image: exportCourse6,
        description: "點選 Console。貼上剛剛複製的腳本，按下 Enter。",
    },
    {
        image: exportCourse7,
        description: "完成！",
    },
];

export const courseDetectiveElements = [
    {id: "liberal-arts", content: "博雅課程", enabled: true},
    {id: "sports-fitness", content: "運動與健康(大一必修)", enabled: true},
    {id: "sports-other", content: "運動與健康(其他)", enabled: true},
    {id: "cross-department", content: "跨院選修", enabled: true},
    {id: "chinese-critical-thinking", content: "中文思辨與表達", enabled: true},
    {id: "random-courses", content: "隨機大學部課程", enabled: false},
    {id: "random-graduate-courses", content: "隨機研究所課程", enabled: false},
    {id: "english-beginner", content: "英文初級", enabled: false},
    {id: "english-intermediate", content: "英文中級", enabled: false},
    {id: "english-advanced-mid", content: "英文中高級", enabled: false},
    {id: "english-advanced", content: "英文高級", enabled: false},
];

export const websiteColor = {
    mainColor: "#009e96",
    mainDarkerColor: "#008e86",
    mainLighterColor: "#b2e2df",
    boxShadowColor: "rgba(0, 158, 150, 0.25)",
};

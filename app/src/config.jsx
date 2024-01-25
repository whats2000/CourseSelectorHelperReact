export const announcementData = {
    version: "v5.0.0 dev",
    latestSemester: "112下",
    updateDate: "2024/01/16",
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
            課程資料是爬蟲下來的靜態資料，若有校方<span className="text-danger fw-bold">有異動</span>，本人尚未更新的話<span className="text-danger fw-bold">請聯絡</span>，感謝。
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
    latestSource: "https://raw.githubusercontent.com/CelleryLin/selector_helper/master/all_classes/all_classes_1122_20240116.csv",
}

export const websiteColor = {
    mainColor: "#009e96",
    mainDarkerColor: "#008e86",
    mainLighterColor: "#b2e2df",
    boxShadowColor: "rgba(0, 158, 150, 0.25)",
};
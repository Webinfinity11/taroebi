// Editable site content: defaults (what the site shows until an admin edits it) and the
// field layout the admin editor renders. Client-safe: no server imports here.
// Contacts and texts below are placeholders: edit them in /admin/content or replace here.

export type Link = { label: string; href: string };

export const contentDefaults = {
  site: {
    company: "შპს თაროები",
    phone: "+995500000000",
    phoneLabel: "(+995) 500 00 00 00",
    email: "info@example.ge",
    address: "თბილისი, საქართველო",
    hours: "ორშაბათი - შაბათი, 10:00 - 19:00",
    freeDeliveryFrom: 500,
    lat: 41.7151,
    lng: 44.8271,
  },
  header: {
    topbarText: "უფასო მიწოდება თბილისში 500 ₾-დან",
    topLinks: [
      { label: "მიწოდება და გადახდა", href: "/delivery" },
      { label: "ხშირად დასმული კითხვები", href: "/faq" },
    ] as Link[],
    navLinks: [
      { label: "მთავარი", href: "/" },
      { label: "კატალოგი", href: "/catalog" },
      { label: "ჩვენ შესახებ", href: "/about" },
      { label: "კონტაქტი", href: "/contact" },
    ] as Link[],
    offerLabel: "ფასდაკლებები",
    offerHref: "/catalog?sale=1",
  },
  footer: {
    description: "თაროები საწყობისთვის, მაღაზიისთვის, ოფისისა და სახლისთვის - მიწოდებითა და მონტაჟით.",
    menuTitle: "მენიუ",
    menuLinks: [
      { label: "ჩვენ შესახებ", href: "/about" },
      { label: "კატალოგი", href: "/catalog" },
      { label: "მიწოდება და გადახდა", href: "/delivery" },
      { label: "ხშირად დასმული კითხვები", href: "/faq" },
      { label: "კონტაქტი", href: "/contact" },
    ] as Link[],
    categoriesTitle: "კატეგორიები",
    contactTitle: "დაგვიკავშირდით",
  },
  home: {
    heroTitle: "შეარჩიეთ თაროები\nთქვენი სივრცისთვის",
    heroText: "გამძლე და პრაქტიკული თაროები\nმაღაზიისა და საწყობისთვის.",
    heroButton: "პროდუქციის ნახვა",
    heroImage: "/img/design/hero-shelving.webp",
    categoriesTitle: "კატეგორიები",
    catalogEyebrow: "სავაჭრო და სასაწყობე აღჭურვილობა",
    features: [
      {
        title: "მეტალის\nკარადები",
        text: "გამძლე და პრაქტიკული\nგადაწყვეტილება თქვენი\nბიზნესისთვის.",
        button: "კატალოგის ნახვა",
        href: "/catalog",
        image: "/img/design/metal-lockers.webp",
      },
      {
        title: "პოს-მასალები",
        text: "თანამედროვე და პრაქტიკული\nგადაწყვეტილებები თქვენი\nსავაჭრო სივრცისთვის.",
        button: "კატალოგის ნახვა",
        href: "/catalog",
        image: "/img/design/scanner-protector.webp",
      },
    ],
    productsTitle: "პროდუქცია",
    consultTitle: "დაგეგმეთ თქვენი სივრცე",
    consultText: "შეარჩიეთ თქვენთვის საჭირო აღჭურვილობა.",
    consultButton: "დაგვიკავშირდით",
  },
  about: {
    title: "ჩვენ შესახებ",
    intro:
      "ჩვენ ვაწარმოებთ და ვყიდით თაროებს საწყობებისთვის, მაღაზიებისთვის, ოფისებისა და სახლებისთვის. ყველა პროდუქტი მზადდება ხარისხიანი მასალისგან და გათვლილია ხანგრძლივ გამოყენებაზე.",
    note: "გვაქვს როგორც სტანდარტული ზომების თაროები მარაგიდან, ასევე ვამზადებთ ინდივიდუალური ზომებით.",
    stats: [
      { value: "100+", label: "მოდელი კატალოგში" },
      { value: "1-3 დღე", label: "მიწოდება თბილისში" },
    ],
    missionTitle: "რას გთავაზობთ",
    mission: [
      "საწყობის და სამრეწველო სტელაჟები მაღალი დატვირთვისთვის, საოფისე და საარქივო თაროები, სახლის და მაღაზიის თაროები.",
      "დაგეხმარებით სწორი კონფიგურაციის შერჩევაში: ზომა, თაროების რაოდენობა, დატვირთვა და მონტაჟი.",
    ],
    reasonsTitle: "რატომ ჩვენ?",
    reasonsText: "ჩვენ გთავაზობთ:",
    reasons: ["კონკურენტულ ფასს", "ხარისხიან მასალას", "მიწოდებას და მონტაჟს", "ინდივიდუალურ ზომებს"],
    clientsTitle: "ვისთვის არის ჩვენი თაროები?",
    clientsText: "ჩვენი პროდუქცია გამოიყენება:",
    clients: ["საწყობებში", "მაღაზიებში", "ოფისებში", "არქივებში", "ავტოსერვისებში", "სახლებსა და ავტოფარეხებში"],
    howtoEyebrow: "როგორ შევუკვეთო?",
    howtoTitle: "შეკვეთა შეგიძლიათ პირდაპირ საიტზე",
    howtoText:
      "დაამატეთ თაროები კალათაში და გააფორმეთ შეკვეთა. ინდივიდუალური ზომებისთვის დაგვიკავშირდით და გამოგიგზავნით შეთავაზებას.",
  },
  contact: {
    title: "დაგვიკავშირდით",
    text: "ნებისმიერი კითხვის შემთხვევაში დაგვირეკეთ ან მოგვწერეთ - ოპერატიულად დაგეხმარებით.",
    boxEyebrow: "ბიზნესისთვის",
    boxTitle: "თაროები ინდივიდუალური ზომით",
    boxText: "გამოგვიგზავნეთ სივრცის ზომები და დატვირთვის მოთხოვნა - მოგამზადებთ შეთავაზებას მიწოდებითა და მონტაჟით.",
    boxPoints: ["უფასო კონსულტაცია", "ინდივიდუალური ზომები", "მიწოდება და მონტაჟი"],
    boxButton: "მოგვწერეთ",
  },
  delivery: {
    title: "მიწოდება და გადახდა",
    sections: [
      {
        title: "მიწოდება",
        text: "თბილისში მიწოდება 1-3 სამუშაო დღეში. 500 ₾-დან შეკვეთაზე მიწოდება თბილისში უფასოა. რეგიონებში მიწოდების ღირებულება და ვადა თანხმდება შეკვეთის დადასტურებისას.",
      },
      {
        title: "მონტაჟი",
        text: "თაროების აწყობა ადგილზე შესაძლებელია დამატებითი საფასურით - მიუთითეთ შეკვეთის კომენტარში.",
      },
      {
        title: "გადახდა",
        text: "შეკვეთის გაფორმების შემდეგ მენეჯერი დაგიკავშირდებათ დასადასტურებლად. გადახდა შესაძლებელია ნაღდი ანგარიშსწორებით მიწოდებისას ან საბანკო გადარიცხვით.",
      },
    ],
  },
  faq: {
    title: "ხშირად დასმული კითხვები",
    items: [
      {
        question: "რა დატვირთვას უძლებს თარო?",
        answer: "თითოეულ პროდუქტზე მითითებულია დატვირთვა ერთ თაროზე (კგ). საწყობის სტელაჟები გათვლილია 150-დან 500 კგ-მდე ერთ თაროზე.",
      },
      {
        question: "შეგიძლიათ ინდივიდუალური ზომის დამზადება?",
        answer: "დიახ. მოგვწერეთ სასურველი სიგანე, სიმაღლე, სიღრმე და თაროების რაოდენობა - გამოგიგზავნით ფასს.",
      },
      {
        question: "გჭირდებათ ინსტრუმენტები ასაწყობად?",
        answer: "უმეტესი მოდელი იწყობა ინსტრუმენტების გარეშე. სურვილისამებრ, აწყობას ჩვენი გუნდი უზრუნველყოფს.",
      },
      { question: "რამდენ ხანში მოიტანთ?", answer: "თბილისში 1-3 სამუშაო დღეში, რეგიონებში 3-7 დღეში." },
    ],
  },
};

export type Content = typeof contentDefaults;
export type ContentKey = keyof Content;

// ───────── admin editor layout ─────────

type Sub = { name: string; label: string; long?: boolean };
export type FieldSpec =
  | { name: string; label: string; type: "text" | "textarea" | "number"; hint?: string }
  | { name: string; label: string; type: "list"; hint?: string; long?: boolean }
  | { name: string; label: string; type: "objects"; hint?: string; fields: Sub[]; fixed?: boolean };

const link: Sub[] = [
  { name: "label", label: "ტექსტი" },
  { name: "href", label: "ბმული (მაგ. /about)" },
];

export const contentSections: { key: ContentKey; title: string; description: string; fields: FieldSpec[] }[] = [
  {
    key: "site",
    title: "საკონტაქტო ინფორმაცია",
    description: "ტელეფონი, ელფოსტა, მისამართი - ჩანს ჰედერში, ფუტერში, კონტაქტის გვერდზე და შეკვეთისას.",
    fields: [
      { name: "company", label: "კომპანიის სახელი", type: "text" },
      { name: "phoneLabel", label: "ტელეფონი (როგორც ჩანს)", type: "text", hint: "მაგ. (+995) 500 00 00 00" },
      { name: "phone", label: "ტელეფონი დასარეკად", type: "text", hint: "მხოლოდ ციფრები, მაგ. +995500000000" },
      { name: "email", label: "ელფოსტა", type: "text" },
      { name: "address", label: "მისამართი", type: "text" },
      { name: "hours", label: "სამუშაო საათები", type: "text" },
      { name: "freeDeliveryFrom", label: "უფასო მიწოდება (₾-დან)", type: "number" },
      { name: "lat", label: "რუკა: განედი (lat)", type: "number", hint: "Google Maps-ზე წერტილზე მარჯვენა კლიკი → კოორდინატები" },
      { name: "lng", label: "რუკა: გრძედი (lng)", type: "number" },
    ],
  },
  {
    key: "header",
    title: "ჰედერი",
    description: "ზედა ზოლი და მთავარი მენიუ.",
    fields: [
      { name: "topbarText", label: "ზედა ზოლის ტექსტი", type: "text" },
      { name: "topLinks", label: "ზედა ზოლის ბმულები", type: "objects", fields: link },
      { name: "navLinks", label: "მენიუს ბმულები", type: "objects", fields: link },
      { name: "offerLabel", label: "მარჯვენა ბმულის ტექსტი", type: "text" },
      { name: "offerHref", label: "მარჯვენა ბმული", type: "text" },
    ],
  },
  {
    key: "footer",
    title: "ფუტერი",
    description: "საიტის ქვედა ნაწილი. კატეგორიების სვეტი ავტომატურად ივსება.",
    fields: [
      { name: "description", label: "მოკლე აღწერა ლოგოს ქვეშ", type: "textarea" },
      { name: "menuTitle", label: "მენიუს სათაური", type: "text" },
      { name: "menuLinks", label: "მენიუს ბმულები", type: "objects", fields: link },
      { name: "categoriesTitle", label: "კატეგორიების სათაური", type: "text" },
      { name: "contactTitle", label: "კონტაქტის სათაური", type: "text" },
    ],
  },
  {
    key: "home",
    title: "მთავარი გვერდი",
    description: "ბანერი, ორი დიდი ბლოკი, პროდუქციის სათაური და ქვედა მუქი ბლოკი. სურათი: ატვირთული ფოტოს ბმული ან საიტის გზა (მაგ. /img/design/hero-shelving.webp).",
    fields: [
      { name: "heroTitle", label: "ბანერი: სათაური", type: "textarea", hint: "ახალი ხაზი = გადატანა" },
      { name: "heroText", label: "ბანერი: ტექსტი", type: "textarea" },
      { name: "heroButton", label: "ბანერი: ღილაკი", type: "text" },
      { name: "heroImage", label: "ბანერი: ფოტო", type: "text" },
      { name: "categoriesTitle", label: "კატეგორიების პანელის სათაური", type: "text" },
      { name: "catalogEyebrow", label: "კატალოგის ბანერის ზედა წარწერა", type: "text" },
      {
        name: "features",
        label: "ორი დიდი ბლოკი",
        type: "objects",
        fixed: true,
        fields: [
          { name: "title", label: "სათაური" },
          { name: "text", label: "ტექსტი", long: true },
          { name: "button", label: "ბმულის ტექსტი" },
          { name: "href", label: "ბმული (მაგ. /category/slug)" },
          { name: "image", label: "ფოტო" },
        ],
      },
      { name: "productsTitle", label: "პროდუქციის სათაური", type: "text" },
      { name: "consultTitle", label: "მუქი ბლოკი: სათაური", type: "text" },
      { name: "consultText", label: "მუქი ბლოკი: ტექსტი", type: "textarea" },
      { name: "consultButton", label: "მუქი ბლოკი: ღილაკი", type: "text" },
    ],
  },
  {
    key: "about",
    title: "ჩვენ შესახებ",
    description: "„ჩვენ შესახებ“ გვერდის ყველა ტექსტი.",
    fields: [
      { name: "title", label: "სათაური", type: "text" },
      { name: "intro", label: "აღწერა", type: "textarea" },
      { name: "note", label: "დამატებითი ტექსტი", type: "textarea" },
      {
        name: "stats",
        label: "ციფრები",
        type: "objects",
        fields: [
          { name: "value", label: "ციფრი" },
          { name: "label", label: "წარწერა" },
        ],
      },
      { name: "missionTitle", label: "შეთავაზების ბლოკის სათაური", type: "text" },
      { name: "mission", label: "შეთავაზების აბზაცები", type: "list", long: true },
      { name: "reasonsTitle", label: "„რატომ ჩვენ“ სათაური", type: "text" },
      { name: "reasonsText", label: "„რატომ ჩვენ“ ქვესათაური", type: "text" },
      { name: "reasons", label: "„რატომ ჩვენ“ პუნქტები", type: "list" },
      { name: "clientsTitle", label: "„ვისთვის“ სათაური", type: "text" },
      { name: "clientsText", label: "„ვისთვის“ ქვესათაური", type: "text" },
      { name: "clients", label: "გამოყენების სფეროები", type: "list" },
      { name: "howtoEyebrow", label: "ქვედა ბლოკი: ზედა წარწერა", type: "text" },
      { name: "howtoTitle", label: "ქვედა ბლოკი: სათაური", type: "text" },
      { name: "howtoText", label: "ქვედა ბლოკი: ტექსტი", type: "textarea" },
    ],
  },
  {
    key: "contact",
    title: "კონტაქტი",
    description: "კონტაქტის გვერდის ტექსტები. ტელეფონი და მისამართი - „საკონტაქტო ინფორმაციაში“.",
    fields: [
      { name: "title", label: "სათაური", type: "text" },
      { name: "text", label: "ქვესათაური", type: "textarea" },
      { name: "boxEyebrow", label: "აქცენტური ბლოკი: ზედა წარწერა", type: "text" },
      { name: "boxTitle", label: "აქცენტური ბლოკი: სათაური", type: "text" },
      { name: "boxText", label: "აქცენტური ბლოკი: ტექსტი", type: "textarea" },
      { name: "boxPoints", label: "აქცენტური ბლოკი: პუნქტები", type: "list" },
      { name: "boxButton", label: "აქცენტური ბლოკი: ღილაკი", type: "text" },
    ],
  },
  {
    key: "delivery",
    title: "მიწოდება და გადახდა",
    description: "„მიწოდება და გადახდა“ გვერდი.",
    fields: [
      { name: "title", label: "სათაური", type: "text" },
      {
        name: "sections",
        label: "ბლოკები",
        type: "objects",
        fields: [
          { name: "title", label: "სათაური" },
          { name: "text", label: "ტექსტი", long: true },
        ],
      },
    ],
  },
  {
    key: "faq",
    title: "ხშირად დასმული კითხვები",
    description: "FAQ გვერდის კითხვები და პასუხები.",
    fields: [
      { name: "title", label: "სათაური", type: "text" },
      {
        name: "items",
        label: "კითხვები",
        type: "objects",
        fields: [
          { name: "question", label: "კითხვა" },
          { name: "answer", label: "პასუხი", long: true },
        ],
      },
    ],
  },
];

/** Settings row holding the home page category picks ({ ids: number[] }); kept outside the content sections. */
export const HOME_CATEGORIES_KEY = "homeCategories";

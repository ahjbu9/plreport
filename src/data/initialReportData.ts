import { ReportData, ReportSettings } from '@/types/report';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialReportData: ReportData = {
  header: {
    title: 'التقرير الشهري - نوفمبر 2025',
    subtitle: 'تاريخ إصدار التقرير: 19 ديسمبر 2025'
  },
  sections: [
    {
      id: generateId(),
      type: 'kpi',
      title: 'الجزء الأول: منصة "فلسطين صوف"',
      icon: 'chart-line',
      visible: true,
      data: [
        { id: generateId(), icon: 'users', value: '1,250,400', label: 'إجمالي المتابعين', visible: true },
        { id: generateId(), icon: 'file-text', value: '185', label: 'إجمالي المحتوى المنشور', visible: true },
        { id: generateId(), icon: 'heart', value: '3.2 مليون', label: 'إجمالي التفاعلات', visible: true },
        { id: generateId(), icon: 'megaphone', value: '4', label: 'الحملات الإلكترونية', visible: true }
      ]
    },
    {
      id: generateId(),
      type: 'content',
      title: 'أفضل محتوى خلال الشهر',
      icon: 'sparkles',
      visible: true,
      data: [
        { id: generateId(), thumbnail: '', contentType: 'video', description: 'فيديو قصير عن التراث الفلسطيني حقق أكثر من مليون مشاهدة', visible: true },
        { id: generateId(), thumbnail: '', contentType: 'infographic', description: 'إنفوجرافيك عن تطور التكنولوجيا في فلسطين', visible: true },
        { id: generateId(), thumbnail: '', contentType: 'design', description: 'تصميم حملة #تراثنا_هويتنا', visible: true },
        { id: generateId(), thumbnail: '', contentType: 'ai', description: 'محتوى بالذكاء الاصطناعي لتوضيح المعالم التاريخية', visible: true }
      ]
    },
    {
      id: generateId(),
      type: 'table',
      title: 'إجمالي عدد المتابعين',
      icon: 'table',
      visible: true,
      data: [
        {
          id: generateId(),
          title: 'إجمالي عدد المتابعين',
          visible: true,
          columns: [
            { id: generateId(), header: 'المنصة', visible: true },
            { id: generateId(), header: 'عدد المتابعين', visible: true },
            { id: generateId(), header: 'التغيير عن الشهر الماضي', visible: true }
          ],
          rows: [
            { id: generateId(), cells: { 'المنصة': 'تلغرام', 'عدد المتابعين': '450,120', 'التغيير عن الشهر الماضي': '+ 12,500' } },
            { id: generateId(), cells: { 'المنصة': 'فيسبوك', 'عدد المتابعين': '510,600', 'التغيير عن الشهر الماضي': '+ 8,200' } },
            { id: generateId(), cells: { 'المنصة': 'تويتر (X)', 'عدد المتابعين': '125,300', 'التغيير عن الشهر الماضي': '+ 3,100' } },
            { id: generateId(), cells: { 'المنصة': 'إنستغرام', 'عدد المتابعين': '152,880', 'التغيير عن الشهر الماضي': '+ 9,800' } },
            { id: generateId(), cells: { 'المنصة': 'واتساب (قنوات)', 'عدد المتابعين': '11,500', 'التغيير عن الشهر الماضي': '+ 1,150' } }
          ]
        }
      ]
    },
    {
      id: generateId(),
      type: 'table',
      title: 'إجمالي المحتوى المنشور والتفاعل',
      icon: 'bar-chart',
      visible: true,
      data: [
        {
          id: generateId(),
          title: 'التصاميم الإخبارية والمعلوماتية (المجموع: 95 تصميم)',
          visible: true,
          columns: [
            { id: generateId(), header: 'اسم التصميم/الموضوع', visible: true },
            { id: generateId(), header: 'النوع', visible: true },
            { id: generateId(), header: 'التفاعل', visible: true }
          ],
          rows: [
            { id: generateId(), cells: { 'اسم التصميم/الموضوع': 'إنفوجرافيك: تطور قطاع التكنولوجيا في الضفة الغربية', 'النوع': 'تصميم معلومات', 'التفاعل': '150 ألف مشاهدة، 12 ألف إعجاب' } },
            { id: generateId(), cells: { 'اسم التصميم/الموضوع': 'تصميم خبري: افتتاح مشاريع بنية تحتية جديدة', 'النوع': 'تصميم إخباري', 'التفاعل': '95 ألف مشاهدة، 7.5 ألف إعجاب' } }
          ]
        },
        {
          id: generateId(),
          title: 'الفيديوهات (المجموع: 60 فيديو)',
          visible: true,
          columns: [
            { id: generateId(), header: 'اسم الفيديو', visible: true },
            { id: generateId(), header: 'المنصة الأساسية', visible: true },
            { id: generateId(), header: 'المشاهدات', visible: true },
            { id: generateId(), header: 'التفاعل', visible: true }
          ],
          rows: [
            { id: generateId(), cells: { 'اسم الفيديو': 'فيديو قصير (Reel): جولة سريعة في حارات القدس', 'المنصة الأساسية': 'إنستغرام', 'المشاهدات': '1.2 مليون', 'التفاعل': '110 ألف' } },
            { id: generateId(), cells: { 'اسم الفيديو': 'فيديو وثائقي: قصة نجاح شركة ناشئة في رام الله', 'المنصة الأساسية': 'فيسبوك / يوتيوب', 'المشاهدات': '350 ألف', 'التفاعل': '35 ألف' } }
          ]
        },
        {
          id: generateId(),
          title: 'الحملات الإلكترونية (المجموع: 4 حملات)',
          visible: true,
          columns: [
            { id: generateId(), header: 'اسم الحملة', visible: true },
            { id: generateId(), header: 'الهدف', visible: true },
            { id: generateId(), header: 'النتائج الرئيسية', visible: true },
            { id: generateId(), header: 'التقييم', visible: true }
          ],
          rows: [
            { id: generateId(), cells: { 'اسم الحملة': '#تراثنا_هويتنا', 'الهدف': 'الترويج للتراث الفلسطيني المادي وغير المادي.', 'النتائج الرئيسية': 'وصول 2.5 مليون مستخدم، 500 ألف تفاعل.', 'التقييم': 'ممتاز' } },
            { id: generateId(), cells: { 'اسم الحملة': '#ادعم_المنتج_الوطني', 'الهدف': 'تشجيع شراء المنتجات المحلية.', 'النتائج الرئيسية': 'زيادة الوعي بنسبة 30% حسب الاستطلاعات.', 'التقييم': 'جيد جداً' } }
          ]
        }
      ]
    },
    {
      id: generateId(),
      type: 'platforms',
      title: 'الجزء الثاني: المنصات السكسونية',
      icon: 'layout-grid',
      visible: true,
      data: [
        { id: generateId(), title: 'المنصة الشمالية', visible: true, items: [
          { label: 'عدد المتابعين', value: '180,000' },
          { label: 'عدد الفواصل', value: '25' },
          { label: 'عدد التصاميم', value: '40' },
          { label: 'الحملات الإلكترونية', value: 'حملة "شتاء دافئ"' }
        ]},
        { id: generateId(), title: 'المنصة الجنوبية', visible: true, items: [
          { label: 'عدد المتابعين', value: '155,000' },
          { label: 'عدد الفواصل', value: '22' },
          { label: 'عدد التصاميم', value: '35' },
          { label: 'الحملات الإلكترونية', value: 'مبادرة "أرضنا خضراء"' }
        ]},
        { id: generateId(), title: 'منصة خان يونس', visible: true, items: [
          { label: 'عدد المتابعين', value: '195,000' },
          { label: 'عدد الفواصل', value: '30' },
          { label: 'عدد التصاميم', value: '50' },
          { label: 'الحملات الإلكترونية', value: 'تغطية "مهرجان الثقافة"' }
        ]},
        { id: generateId(), title: 'منصة غزة', visible: true, items: [
          { label: 'عدد المتابعين', value: '250,000' },
          { label: 'عدد الفواصل', value: '40' },
          { label: 'عدد التصاميم', value: '65' },
          { label: 'الحملات الإلكترونية', value: 'حملة "صنع في غزة"' }
        ]},
        { id: generateId(), title: 'منصة دير البلح', visible: true, items: [
          { label: 'عدد المتابعين', value: '120,000' },
          { label: 'عدد الفواصل', value: '18' },
          { label: 'عدد التصاميم', value: '30' },
          { label: 'الحملات الإلكترونية', value: 'متابعة المشاريع التنموية' }
        ]}
      ]
    },
    {
      id: generateId(),
      type: 'notes',
      title: 'الجزء الثالث: ملاحظات عامة وتوصيات',
      icon: 'clipboard-list',
      visible: true,
      data: [
        {
          id: generateId(),
          title: 'إنجازات الموظفين',
          icon: 'award',
          visible: true,
          items: [
            'تكريم المصمم "أحمد خالد" لتصميمه المبتكر في حملة #تراثنا_هويتنا الذي حقق أعلى تفاعل.',
            'جهود مميزة من فريق الفيديو في إنتاج سلسلة فيديوهات قصيرة حققت انتشاراً واسعاً على منصة إنستغرام.',
            'نجاح مدير المنصات "سارة علي" في زيادة عدد المتابعين على قناة التلغرام بنسبة غير مسبوقة.'
          ]
        },
        {
          id: generateId(),
          title: 'الاجتماعات والمستجدات',
          icon: 'calendar',
          visible: true,
          items: [
            'الاجتماع الأسبوعي بتاريخ 15 نوفمبر: تم إقرار خطة المحتوى لشهر ديسمبر مع التركيز على فعاليات نهاية العام.',
            'ورشة عمل بتاريخ 25 نوفمبر: تدريب الفريق على أحدث تقنيات تحسين محركات البحث (SEO) للمحتوى الرقمي.',
            'تم الاتفاق على إطلاق بودكاست شهري جديد ابتداءً من يناير 2026 لمناقشة القضايا الثقافية والاجتماعية.'
          ]
        },
        {
          id: generateId(),
          title: 'ملاحظات الأداء والتوصيات',
          icon: 'lightbulb',
          visible: true,
          items: [
            'لوحظ أن محتوى الفيديو القصير (Reels) يحقق أعلى معدلات وصول وتفاعل، يوصى بزيادة إنتاجه بنسبة 25%.',
            'التفاعل على منصة تويتر (X) أقل من المتوقع مقارنة بالمنصات الأخرى، يوصى بتطوير استراتيجية محتوى خاصة بالمنصة تركز على الأخبار العاجلة والنقاشات الحية.',
            'الحملات التي تعتمد على مشاركة الجمهور (User-Generated Content) مثل #تراثنا_هويتنا أثبتت نجاحها، يوصى بتبني هذا النهج في الحملات القادمة.',
            'يوصى بتخصيص ميزانية إعلانية صغيرة لتجربة الترويج للمحتوى المتميز على منصة فيسبوك لزيادة الوصول إلى شرائح جديدة من الجمهور.'
          ]
        }
      ]
    }
  ],
  footer: {
    line1: 'تقرير مقدم من قسم الإعلام الرقمي - منصة فلسطين صوف',
    line2: '© 2025 جميع الحقوق محفوظة.'
  }
};

export const initialSettings: ReportSettings = {
  showHeader: true,
  showFooter: true,
  showKPIs: true,
  showPlatformCards: true,
  showNotes: true,
  showContent: true,
  enableTableStriping: true,
  enableHoverEffects: true,
  primaryColor: '#00796b',
  accentColor: '#d4af37',
  email: {
    emails: [],
    organizationName: 'منصة فلسطين صوف',
    reportMonth: 'نوفمبر 2025'
  },
  theme: {
    primaryColor: 'teal',
    accentColor: 'gold',
    cardStyle: 'modern',
    fontFamily: 'both'
  }
};

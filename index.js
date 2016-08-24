// 調用插件
$('#input-box').verySuggester({
	width: 250,
	themeColor: '#28a9e0',
  limitHeight: 60,
  limitItem: 3,
  searchList: ['qq.com', '163.com', 'gmail.com', 'sina.com', 'gmailbox.com']
});
$('#input-box2').verySuggester({
  pivotType: 'top',
  additionalClass: 'mobile-suggester',
  searchList: ['qq.com', '163.com', 'gmail.com', 'sina.com', 'qq123.com']
});

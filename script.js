// markov chain code stolen from: http://www.soliantconsulting.com/blog/2013/02/draft-title-generator-using-markov-chains


$(document).ready(function(){
	$.getJSON('descriptions.json', function( data ) {
		var items = [];
		$.each( data.entries, function( key, val ) {
			var description = val.replace(/\n+?/g, ' ').replace(/  /g, ' ');
			content.push(description);
		});
		markov();
		generate();
		$('#generate').on('click', generate);
	});

});

var terminals = {};
var startwords = [];
var wordstats = {};
var content = [];

var generate = function () {
	var title = make_title(4 + Math.floor(3 * Math.random()));
	if (title.slice(-1) != '.') title = title + '.';

	$('#generated_title').html(title);
	$('#tweet').html('<iframe allowtransparency="true" frameborder="0" scrolling="no" src="https://platform.twitter.com/widgets/tweet_button.html?related=grapefrukt&count=none&text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent('http://markovsnack.grapefrukt.com') + '&hashtags=markovsnack" style="width:60px; height:20px;"></iframe>');
}

var markov = function(){
	for (var i = 0; i < content.length; i++) {
		var words = content[i].split(' ');
		terminals[words[words.length-1]] = true;
		startwords.push(words[0]);
		for (var j = 0; j < words.length - 1; j++) {
			if (wordstats.hasOwnProperty(words[j])) {
				wordstats[words[j]].push(words[j+1]);
			} else {
				wordstats[words[j]] = [words[j+1]];
			}
		}
	}
}

var choice = function (a) {
	var i = Math.floor(a.length * Math.random());
	return a[i];
};

var make_title = function (min_length) {
	word = choice(startwords);
	var title = [word];
	while (wordstats.hasOwnProperty(word)) {
		var next_words = wordstats[word];
		word = choice(next_words);
		title.push(word);
		if (title.length > min_length && terminals.hasOwnProperty(word)) break;
		if (title.length > min_length + 5) break;
	}
	if (title.length < min_length) return make_title(min_length);
	return title.join(' ');
};

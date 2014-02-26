var ospritz = ospritz || {

	start: 0,
	last: 0,
	timer: null,

	getWords: function(sourceElement)
	{
		var text = sourceElement.text();
		var trimToWords = function(str)
		{
			return str.replace(/^[^a-z]*|[^a-z\n]*$/gi, "");
		};
		var removeRepeatedGaps = function(a, b, index, arr)
		{
			if(a[a.length-1] != "" && a.length > 0 || b != "")
			{
				a.push(b);
			}
			return a;
		};
		return text.split(/[\n\.]+|\s+/g).map(trimToWords).reduce(removeRepeatedGaps,[]);
	},

	splitWord: function(word) 
	{
		var pivot = 1;

		switch (word.length) 
		{
			case 0:
			case 1:
				pivot = 0;
			break;
			case 2:
			case 3:
			case 4:
			case 5:
				pivot = 1;
			break;
			case 6:
			case 7:
			case 8:
			case 9:
				pivot = 2;
			break;
			case 10:
			case 11:
			case 12:
			case 13:
				pivot = 3;
			break;
			default:
				pivot = 4;
		};

		return [word.substring(0,pivot), word.substring(pivot, pivot+1), word.substring(pivot+1)];
	},

	drawWord: function(word, outputElement)
	{
		var splitWord = this.splitWord(word);
		outputElement.find('.left .text').html(splitWord[0]);
		outputElement.find('.pivot').html(splitWord[1]);
		outputElement.find('.right').html(splitWord[2]);
	},

	startSpritzing: function(words, wpm, outputElement)
	{
		var self = this;
		var currentIndex = 0;
		var started = Date.now();

		console.log(started);

		var doNextWord = function() {
			console.log(words[currentIndex]);
			self.drawWord(words[currentIndex], outputElement)
			currentIndex++;
			if(currentIndex == words.length) 
			{
				console.log(Date.now());
				return; //all out of words
			}
			readWordsStartingAt(currentIndex);
		}

		var readWordsStartingAt = function(index)
		{
			var padding = words[currentIndex] == "" ? 2.5 : 1;
			clearTimeout(self.timer);
			self.timer = setTimeout(doNextWord, (60*1000*padding)/wpm);
		};

		readWordsStartingAt(0);
	},


	init: function(sourceElement, outputElement, wpm)
	{
		if (!window.jQuery) throw "jQuery Not Loaded";
		clearTimeout(this.timer);
		var words = this.getWords(sourceElement);
		this.startSpritzing(words, wpm, outputElement);
	}

};
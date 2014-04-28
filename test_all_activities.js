/**
 * tools: casperjs/phantomjs
 *
 * This test navigates to all the activities 
 * and tests that they display correctly
 *
 * Run command:
 * casperjs --ignore-ssl-errors=true test test_payment_pages.js
 *
 * @author J.Stone
 */
var login = 'https://master.pub.voxy.com/u/login/';
var logout = 'https://master.pub.voxy.com/u/logout/';
var quiz = 'https://master.pub.voxy.com/activities/lesson/by-resource/5314eeb772dd6848880c7459/quiz/';
var wordscramble = 'https://master.pub.voxy.com/activities/lesson/by-resource/5314eeb772dd6848880c7459/wordscramble/';

//casperjs setup
var x = require('casper').selectXPath;
var casper = require('casper').create({
 	 //verbose: true, 
 	 //logLevel: 'debug'
});

//initialize the casper object and login to the website
casper.test.begin('setup', 1, function(test) {
	casper.start(login, function() {
		this.fill('form#ajax-login-form', {
		'username':    'newu1@voxy.com',
		'password':    'things'
		}, true);
	});

	casper.then(function() {
		this.wait(1000, function() {
			//check for the substring "guide/recommend/" in the url
			this.test.assert((this.getCurrentUrl().indexOf("guide/recommend/") != -1), "guide is displayed");
		});
	});

	casper.run(function() {
		test.done();
	});
});

/**
**********************
* Test QUIZ activity *
**********************
**/
casper.test.begin("Test text article QUIZ activity", 14, function(test) {
	casper.start(quiz);

	//check the pre-activity page
	casper.then(function() {
		test.assertUrlMatch(quiz, 'quiz url is displayed');
		test.assertSelectorHasText(x('//*[@id="content"]/div[3]/div/div[1]/div[1]/div[1]/div/div[2]/div/h5'), '\"The Starry Night\" by Van Gogh');
		test.assertExists(x('//*[@id="resource-jplayer-container-0"]'), 'player displays');		
		test.assertExists(x('//*[@id="content"]/div[3]/div/div[1]/div[1]/div[1]/div/div[1]/img'), 'article image displays');
		test.assertExists(x('//*[@id="content"]/div[3]/div/div[2]/div/div[1]/div/div[1]/div/button'), 'ok button displays');
		//click the 'OK, I'm Ready' button
		this.click(x('//*[@id="content"]/div[3]/div/div[2]/div/div[1]/div/div[1]/div/button'));
	});

	//check the instructional screen before starting the activity
	casper.waitForSelector(x('//*[@id="content"]/div[3]/div/div[2]/div/div[1]/div/div[2]/button'), function() {
		test.assertExists(x('//*[@id="content"]/div[3]/div/div[2]/div/div[1]/div/div[1]/div/div[1]/div[2]/div[1]'), 'instructional text displays');
		//click the 'Start' button
		this.click(x('//*[@id="content"]/div[3]/div/div[2]/div/div[1]/div/div[2]/button'));
	});

	//check first question in activity
	casper.waitForSelector(x('//*[@id="content"]/div[3]/div/div[2]/div/div[1]/div/div[2]/div[2]/b[1]'), function() {
		//check for all the answer choices showing
		test.assertExists(x('//*[@id="content"]/div[3]/div/div[2]/div/div[2]/div/div/ol/li[1]/a'), 'first answer choice displays');
		test.assertExists(x('//*[@id="content"]/div[3]/div/div[2]/div/div[2]/div/div/ol/li[2]/a'), 'second answer choice displays');
		test.assertExists(x('//*[@id="content"]/div[3]/div/div[2]/div/div[2]/div/div/ol/li[3]/a'), 'third answer choice displays');
		test.assertExists(x('//*[@id="content"]/div[3]/div/div[2]/div/div[2]/div/div/ol/li[4]/a'), 'fourth answer choice displays');
		test.assertExists(x('//*[@id="footer"]/div/div/div[2]/div'), '1 out of 1 displays in footer')
		//click the first answer choice
		this.click(x('//*[@id="content"]/div[3]/div/div[2]/div/div[2]/div/div/ol/li[1]/a'));
	});

	casper.then(function() {
		test.assertExists(x('//*[@id="footer"]/div/div/div[2]/button'), 'next button displays');
		test.assertExists(x('//*[@id="content"]/div[3]/div/div[2]/div/div[1]/div/div[1]/div/div[1]/div[3]/div'), 'score is displayed');
		//click the next button
		this.click(x('//*[@id="footer"]/div/div/div[2]/button'));
	});

	//wait for the post-activity screen to display
	casper.waitForSelector(x('//*[@id="content"]/div[3]/div[1]/div[2]/div/div/a'), function() {
		test.assertSelectorHasText(x('//*[@id="content"]/div[3]/div[1]/div[2]/div/div/span/h3'), 'You\'re done!');
	});

	casper.run(function() {
		test.done();
	});
});



/**
******************************
* Test WORDSCRAMBLE activity *
******************************
**/
casper.test.begin("Test text article WORDSCRAMBLE activity", 0, function(test) {
	casper.start(wordscramble);

	//check the pre-activity page
	casper.then(function() {
		test.assertUrlMatch(wordscramble, 'wordscramble url is displayed');
		//click the 'OK, I'm Ready' button
		this.click(x('//*[@id="content"]/div[3]/div/div[2]/div/div[1]/div/div[1]/div/button'));
	});


	casper.run(function() {
		test.done();
	});
});



//neccessary to clear the casper instance being passed around
casper.test.begin("teardown", 1, function(test) {
    casper.start(logout, function() {
    	test.assertUrlMatch(logout, 'logout url is displayed');
    });		

	casper.run(function() {
		test.done();
		this.exit();
	});
});



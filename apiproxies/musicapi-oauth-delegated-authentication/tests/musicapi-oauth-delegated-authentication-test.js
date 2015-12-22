/*globals describe:true, it:true, expect:true, before:true, beforeEach:true, after:true, afterEach:true*/
/*jslint node: true */
/*jshint unused:false */
/*eslint no-unused-vars:0 */

var chai = require('chai')
var assert = require('chai').assert
var expect = require('chai').expect
var request = require('request');
var qs = require('querystring');

// Config
var ORG_NAME = 'aramk';
var CLIENT_ID = 'oIIEEmaXR4mY9aq4FDA9obIHIBOQjMsD';
var CLIENT_SECRET = 'xceCzdIvi9smEmx4';

describe('ForecastWeather Public API Test',function() {
  "use strict";
  before(function () {
    // get OAuth 2.0 token
    // console.log('initialize');
  });
  beforeEach(function () {
    //console.log('initialize each test');
  });

  var tokens = {};

  describe('Generate access token', function() {
    it('you should be able to generate an access token.', function(done) {
      var options = {url :'https://' + ORG_NAME + '-test.apigee.net/oauth-delegated/generatetoken?',
        headers : { 'Content-Type' : 'application/x-www-form-urlencoded' },
        form: { client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type : 'client_credentials'},
        method : 'POST'};
      var params = { external_access_token: "123456" };
      options.url += qs.stringify(params);
      request(options, function(error, res, body){
          expect(body).to.include('access_token');
          tokens.access_token = JSON.parse(body).access_token;
          done();
      })
  });
  });

  describe('Access a protected resource', function() {
    var bodyTestCase = {};
    it('you should be able to access music resource with an access token with 200 OK response', function(done) {
      var options = {url :'https://' + ORG_NAME + '-test.apigee.net/oauth-delegated/music?',
        headers : { 'Authorization' : 'Bearer ' + tokens.access_token },
        method : 'GET'};
      var params = { func: "getSong", artist : 'radiohead', fmt : 'json' };
      options.url += qs.stringify(params);
      request(options, function(error, res, body){
        bodyTestCase = body;
        expect(res.statusCode).to.equal(200);
        done();
      })
    });
    it('you should be able to get a result from Radiohead', function(done){
      expect(JSON.parse(bodyTestCase)).to.have.deep.property('artist', 'Radiohead');
      done();
    })
    it('you should be able to get the first album as Pablo Honey', function(done){
      expect(JSON.parse(bodyTestCase)).to.have.deep.property('albums[0].album', 'Pablo Honey');
      done();
    })
});

});

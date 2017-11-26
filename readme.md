# East Boston Sound Read Me
I live right next to Logan Airport in East Boston. On many occasions, I was sure that some planes were breaking the residential noise laws in place so I hooked up a decibel reader to a Raspberry Pi and recorded sound readings in a SQL database. This site is my first try at D3 to visualize one day's worth of sound recordings - 74,000 records in all.

**Link to project:** http://davidjkelley.net/sound/
*This is hosted on my partner's website.*

![Alt text](/images/screenshot.JPG?raw=true "Screenshot")

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, jQuery, D3, SQL, Python

For the first iteration of this site, I dumped the SQL data from the database and just used JSON of one day's worth of readings to create this line graph using D3.js.

## Optimizations

I went through many iterations of using stagnant data before landing on JSON for simplicity and speed.

## Lessons Learned:

There's always so much more to do! This was my first project using D3.js In the future, I hope to use the live data and update directly from the SQL database.

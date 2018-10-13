<h1><a id="Virtual_Shop_0"></a>Virtual Shop</h1>
<p><a href="https://nodesource.com/products/nsolid"><img src="https://cldup.com/dTxpPi9lDf.thumb.png" alt="N|Solid"></a></p>
<p><a href="https://github.com/alex-garmash/VirtualShop"><img src="https://travis-ci.org/joemccann/dillinger.svg?branch=master" alt="Build Status"></a></p>
<p>Virtual Shop build with technologies:</p>
<ul>
<li>Node.js</li>
<li>Angular 5</li>
<li>ES6</li>
<li>MongoDB</li>
<li>Material Design</li>
</ul>
<h1><a id="What_can_Virtual_Shop_do_14"></a>What can Virtual Shop do?</h1>
<ul>
<li>First of all web secured, using bcrypt and use json web token to authenticate login.</li>
<li>In virtual shop you have user permissions like: admin, user also you can ban users.</li>
<li>Register new users to buy from shop.</li>
<li>As admin you can create/update products, categories.</li>
<li>Upload pictures for products, if you edit with some new picture, old one will be deleted automatically.</li>
<li>Uploded pictures saved in folder uploads.</li>
<li>User can search products by name or categories.</li>
<li>Also user can search product by name in order before buying.</li>
<li>All products in shopping cart saved in data base, so user can close browser and next time when user open his shopping cart everything will be there.</li>
<li>After ordering you can download list of buyed products as PDF file.</li>
</ul>
<h3><a id="Installation_28"></a>Installation</h3>
<p>requires <a href="https://nodejs.org/">Node.js</a> v4+ to run server.</p>
<p>Install the dependencies and devDependencies and start the server.</p>
<pre><code class="language-sh">$ <span class="hljs-built_in">cd</span> server
$ npm install express
$ npm install mongoose
$ npm install jsonwebtoken
$ npm install multer
$ npm install bcrypt
$ npm install body-parser
$ node app
</code></pre>
<h3><a id="Plugins_45"></a>Plugins</h3>
<p>Dillinger is currently extended with the following plugins. Instructions on how to use them in your own application are linked below.</p>
<table class="table table-striped table-bordered">
<thead>
<tr>
<th>Plugin</th>
<th>README</th>
</tr>
</thead>
<tbody>
<tr>
<td>Express</td>
<td><a href="https://github.com/expressjs/express/blob/master/Readme.md">README.md</a></td>
</tr>
<tr>
<td>Mongoose</td>
<td><a href="https://github.com/Automattic/mongoose/blob/master/README.md">README.md</a></td>
</tr>
<tr>
<td>Json Web Token</td>
<td><a href="https://github.com/auth0/node-jsonwebtoken/blob/master/README.md">README.md</a></td>
</tr>
<tr>
<td>Multer</td>
<td><a href="https://github.com/expressjs/multer/blob/master/README.md">README.md</a></td>
</tr>
<tr>
<td>Bcrypt</td>
<td><a href="https://github.com/kelektiv/node.bcrypt.js/blob/master/README.md">README.md</a></td>
</tr>
<tr>
<td>Body Parser</td>
<td><a href="https://github.com/expressjs/body-parser/blob/master/README.md">README.md</a></td>
</tr>
</tbody>
</table>
<h2><a id="License_61"></a>License</h2>
<p>MIT</p>

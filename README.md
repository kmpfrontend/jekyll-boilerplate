#Boilerplate with Jekyll

This new build uses Jekyll, https://jekyllrb.com/docs/installation/

On Windows: https://jekyllrb.com/docs/windows/

Check to see if Jekyll is installed, should be version 3.4.3. 

    jekyll -v

If not, install it.

    jekyll install

Then may need to do

    bundle install

Then once it is installed, just run

    grunt


##Installation/Setup

To create a new site you will need to open a terminal and run the following commands::

    npm install

    bower install

##Jekyll 

As we now use Jekyll, the frontend setup is slightly different to how the Assemble site's are. Each component is still added into the _components and _includes folder's but there is some additional info needed for each at the top, like here: 

    ---
    title: "Hero"
    component: true
    ---

There are lots of tutorials on how to use Jekyll, we moved to Jekyll as this is more widely used, which allows better support and plugins to help with the builds.



##Bower

All <a href="http://blog.teamtreehouse.com/getting-started-bower">bower</a> is setup to go so if you need to add a new library then just find the bower reference, for example:

    bower install masonry

Look in the bower.json file and make sure the dependancy has been added to this so othe∏r people can use when they work on a project. Something like this

    bower install --save masonry

If CSS styling is needed to be included from the plugin, for example fancybox. First go into the gruntfile and add it into the bower_concat plugin, like this:

    bower_concat: {
        all: {
            mainFiles: {
                    'pickadate': [
                    "lib/picker.js",
                    "lib/picker.date.js",
                    "lib/picker.time.js",
                    "lib/themes/classic.css",
                    "lib/themes/classic.date.css",
                    "lib/themes/classic.time.css"
                ],
                    'retina.js': 'dist/retina.js',
                    'fancybox': [
                    // "source/jquery.fancybox.pack.js",
                    "source/jquery.fancybox.js",
                    "source/helpers/jquery.fancybox-media.js",
                    "source/jquery.fancybox.css"
                ]
            }
        }
    },

The above will make sure the CSS styles from the plugin will be added into the bower partial. DO NOT edit the bower partial directly.

##Directory Structure

frontend - contains all the source code and html   
backend - for backend devs   
compiled - compiled front end code (this is ignored from repo and never should be touched)

##Frontend Build

    grunt

##Font Sizes and Measurements

Font sizing is done via REM.

    font-size: 1.6rem; // 16px

Padding and Margin's use the same method.

     padding: 2rem; // 20px

Convert px width's to % values, mainly used for panel width's etc. (75px is width I want. 400px is the width of the container it sits in)

    width: 400px;
    padding: 0 percentage(75/400);

To convert a px value to % to be relative to the main width of the design then do the following, the main width is a variable. Default is 1024px

    .reviews-block {
    	// Converts a px value to show a % size instead
    	padding-top: c(60);
    	padding-bottom: c(54);
    }

##Adding Sass files

Add a new sass file to one of the directories, if there is a _all.scss file then there is no need to add this to the main core sass file, it will automatically add this in.

##Default Plugins

I have added in 2 well used plugin's to the sass build, this is for the slider and datepicker, which will have the correct styling in place

##Sliders/Carousels

We use Slick Slider to create our carousels/sliders. [More Info](http://kenwheeler.github.io/slick/)

##Media Queries

For media queries we are using breakpoint-sass. http://breakpoint-sass.com/

    .test {
        @include breakpoint($desktop) {
            padding: 1rem 0;
        }
    }

Here are the variables we use commonly, no need to make more really:

    $mobile-land: 480px;
    $tablet-sml: 600px;
    $tablet: 768px;
    $desktop-sml: 1024px;
    $desktop: 1200px;
    $wide: 1400px;
    $uber: 1800px;

    //Retina
    $hidpi: min-resolution 1.5dppx;


On some sites the media queries are done differently.

    .test {
        @include mq(desktop) {
            padding: 15px 0;
        }
    }

For retina files, use the correct variable

    @include breakpoint ($hidpi) { 
        background-size: $sprite-2x-size;
        @include sprite-2x($email-2x);
    }

[More Info](https://github.com/at-import/breakpoint/wiki/Advanced-Media-Queries#resolution-media-queries)

##Retina Images

Retina.js will automatically look for 2x versions, just save a file with @2x at the end and the plugin will do the rest. So

    <img src="image.png" alt=""> 

will show a normal image, but if there is a image@2x.png in the folder it will show this on suitable devices.

    <img src="image@2x.png" alt=""> 
    
To add this to the CSS files, a mixin has been created and to call it, do the following (stating the image name, extension and file size, see the slick.scss file for an example):

    @include retina-js("/images/white-slider-arrow", png, 15px, 57px);

##Commenting

All code to be commented as well as possible, not too much but enough so you or anyone else would understand this in 6 months time when the project is no longer fresh in your mind. Below are a few examples of simple commenting which would help

    // Close all tags with a comment to show each closing HTML element

In Sass you can comment either as follows:

    .container {
        width: 100%;
        //padding: rem(10px);
        //height: auto;
    }

but if there are a few items to comment it is best to do as follows:

    .container {
        width: 100%;
        /*padding: rem(10px);
        height: auto;
        background: none;
        margin: none;*/
        line-height: 1.1;
    }


##Javascript

As mentioned above we use Bower for the js to pull in the libraries. To create new functions these are done in the ui.js file. There is a main self invoking anonymous function and all individual functions are declared in here and then called within "initAll" which self invokes. Anything in "initAll" will run on load as the file is included in the HTML and the bottom of the doc so no need to use Doc Ready. We use the Revealing Module Pattern in larger functions [More Info](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript)


##jQuery Library

I have been adding reuseable jQuery snippets to codepen. As we tend to use various methods more than once it seems a good idea to create a stripped down version of each on here. If you create something new, like a zoomable map, then once you have added this on the site, please add it to the codepen site, so this can be easily reused. Take a look at some of the examples on here, so you can see how they should be added. [View KMP CodePen](https://codepen.io/kmp/)


##PostCSS/Browser Fallbacks

Do not worry about browser fallbacks such as code like this:

    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;

This is how to write it as postcss add's in any other fallbacks if needed.

    border-radius:10px;


##Grid Layout

PostCSS Lost Grid system is used. The lost framework docs can be found here: https://github.com/peterramsing/lost

    <section class="row">
        <div class="half">1</div>
        <div class="half">2</div>
    </section>

 Sass is as follows:

    .row {
        lost-utility: clearfix;
    }

    .half {
        lost-column: 1/2 0;
    }


##SVG's

We are using a mixin that can do a SVG as a background image with PNG fallback.

To create a PNG so this can be edited then we use grunticon: https://github.com/filamentgroup/grunticon. This will be setup in Grunt and the necessary files will be in the start.html include so no setup will be needed.

Export the SVG from sketch and save the file inside the 'svg' folder which is in the Images folder.  Add a class in the HTML like below using the name of the SVG and 'icon-***'' before this:

    <span class="icon-logo">


##Image Sprites

Save images in the sprite folder and also the 2x version. Grunt will create the image sprite. Amend the size attributes in the variables sass include.

    .image {
        @include sprite($image-name);

        @include breakpoint($hidpi) {
            background-size: $sprite-2x-size;
            @include sprite-2x($slider-arrow-2x);
        }
    }

HTML will look as follows:

    <span class="image"></span>

Inside the variables include you will need to add the size of the sprint-2x.png.

    $width-2x: 64px;
    $height-2x: 64px;

##BEM

We use BEM method of coding. There are loads of resources online about this, it maybe best to look over recent projects such as Tensar, MSP, Bruntwood to see how we have coded these.

This is an example of how we would write BEM

    .search {
        padding: 10px;

        &__form {
            width: 100%;
        }
    }

This will output as
    
    .search {
        padding: 10px;
    }

    .search__form {
        width: 100%;
    }

Only try and use modifier classes if the HTML is not needed to be changed. Also, use modifier classes on the element if only that is targetted, for example.

This is not ideal.

    .form {
        .notification {
            background: transparent;
        }

        &--success {
            .notification {
                background: green;
            }
        }
    }

This would be better.

    .form {
        .notification {
            background: transparent;

            &--success {
                background: green;
            }
        }
    }

Which would output as

    .form .notification {
        background: transparent;
    }

    .form .notification notification--success {
        background: green;
    }

 Try only ever have one set of underscores, so this is not ideal.

     <div class="wrap">
     	<div class="wrap__container">
     		<h2 class="wrap__container__title">Text Here</h2>
     	</div>
     </div>

If this title is only ever going to be inside here, then can split it out and not use as many underscores

     <div class="wrap">
     	<div class="wrap__container">
     		<h2 class="wrap__title">Text Here</h2>
     	</div>
     </div>


##Form Styling

We wrap each input/label in a new div.

    <div class="form__row">
        <label for="phone">Phone</label>
        <input id="phone" type="tel" placeholder="e.g. 07912 458 741">
    </div>

We usually style up input/radio buttons to get something like below.

    <div class="form__row checkbox">
        <input id="optionName" type="checkbox">
        <label for="optionName"><span></span>Select which you would prefer</label>
    </div>

You would do the same with a radio button but changing the class on the container and also the type on the input tag.


##General Formatting

2 tabs indentation is required. Use a new line for every block, list or table element, and indent every such child element by 2 tabs

    .print {
        display: block;
        margin: 0;
        padding: 0 7px;
        height: 30px;
        background: #4f799f;
        line-height: 30px;
    }

This is bad.

    div.print {
        display: block;
    }
    span.error {
        display: block;
    }

This is good.

    .print {
        display: block;
    }
    .error {
        display: block;
    }

ID's are bad for CSS, only use ID's for javascript hooks when necessary.

For colour reference when you need to use hex then please use the shortened version.

    .block {
        color: #fff;
    }

not

    .block {
        color: #ffffff;
    }

Please Avoid!!

Using the !important rule, unless absolute necessary but even then there must be a way around this!

    .block {
        color: #ffffff !important;
    }

Naming variables things such as the following when used within the sass.

    $yellow: #fff600; 

I would suggest using this method but using the variables.scss mixin to reassign this colour to a variable used globally, for example

    // Local Variables
    $yellow: #fff600; 

    // Global Variables
    $primary: $yellow;

##Seo

Only use 1 h1 tag on the page, we could add multiple h1 tags within section tags etc but ideally stick to one unless otherwise asked not to.

Add title tags to all links and alt tags to all images. Try keep the html and css that is produced as clean as possible.

#Grunt

We use Grunt as a task runner along with many plugin's to make the build more efficient. If any edits or any additions to this file need to be added then they need to be placed inside the folder 'grunt', inside here each plugin will go inside config. You should not need to edit anything inside the tasks folder, but sometimes a plugin may need something adding to the main grunt task.


##Assemble (older sites)

We use <a href="http://assemble.io/docs/">assemble</a> to create the includes and to build the site pages. The <span>default.hbs</span> is the main layout page, this is used on all components etc unless another layout is needed but this should not be needed.


To just loop through showing them all

    {{#each item-list.information}}
        <div class="grid__third">
            {{> item}}
        </div>
    {{/each}}

Limit the amount of loops in the #each

    {{#withFirst item-list}}
        <div class="grid__third">
            {{#each item-list.information}}
                <div class="grid__quarter">
                    <h3>{{title}}</h3>
                    <p class="item__copy">
                        {{copy}}
                    </p>
                </div>
            {{/each}} 
        </div>
    {{/withFirst}} 

This is the json file named item-list.json:

        {
          "information": [
            {
                "title": "getting here",
                "copy": “copy here.”,
                "bg-image": "/images/temp/item-bg-2.jpg"
            },
            {
                "title": "facilities",
                "copy": “more copy“,
                 "bg-image": "/images/temp/item-bg-1.jpg"
            }
          ]
        }

Look at ABP, Event City and Woav as Reference 

Show 2 different versions of logo and content:

    <header class="header-main">
        <h1>{{heading}}<h1>
        <h2>{{strap}}</h2>
        {{#if dark}}
            <img src="../images/logo-dark.png" alt="Milligan logo" class="logo__img">
        {{else}}
            <img src="../images/logo.png" alt="Milligan logo" class="logo__img">
        {{/if}}

        <span class="burger">
            <span class="burger__bar {{#if dark}}burger__bar--dark{{/if}}"></span>
        </span>
    </header>

On the sitepage, add the ‘dark’ and heading and strap tag

    ---
    title: "Our Events"
    ---
    {{> header dark = true}}
    {{> hero heading="Our Events" strap="The ultimate luxury shopping experience for Birmingham"}}

Another example is:

    {{> intro-block sub-heading-title="true" sub-heading="Social" heading="Stay in touch with us" social="true" bg-image="yes" white-text="yes"}}

    <section class="intro-block {{#is bg-image "yes"}}intro-block--img{{/is}}">
        <header>
            {{#if sub-heading-title}}
                <h3 class="heading {{#is white-text "yes"}}heading--light{{/is}}">{{sub-heading}}</h3>
            {{/if}}

            <h2 class="heading {{#is white-text "yes"}}heading--light{{/is}}>{{heading}}</h2>
        </header>
        {{#if social}}
            {{> social-links}}
        {{/if}}
    </section>

// Inside the data folder which is inside the assemble folder, find the base name of the page you are targeting (in site pages.json) and do as follows:

    {{#is basename "book-demo"}}
    <div class="form__row">
        <label for="phone">Phone</label>
        <input id="phone" type="tel" placeholder="Phone">
    </div>
    {{/is}}

site-pages.json file looks similar as follows:

    {
        "pages": [
            {
                "basename": "book-demo",

##Versions

21/4/16 - Added the sprite retina mixins back in. Added modernizr into the site so not pulling a dead URL in the console. Changed svgNew to svg.

01/07/2017 - Changed over to using Jekyll from Assemble. 
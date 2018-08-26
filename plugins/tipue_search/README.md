Tipue Search 7.0
================

A Pelican plugin to serialize generated HTML to JSON that can be used by jQuery plugin - Tipue Search 7.0.

Please refer to [getpelican/pelican-plugins](https://github.com/getpelican/pelican-plugins/tree/master/tipue_search)
for instructions.

What's New
===================

Tipue Search 7.0 now includes images, along with image preview.
Content has been simplified into a JavaScript object, allowing a more flexible content model. The new content properties include note and image.

How Tipue Search works
=========================

Tipue Search serializes the generated HTML into JSON. Format of JSON is as follows

```python
{
    "pages": [
        { 
            "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.",
            "tags": "Example Category",
            "img":,
            "url" : "http://oncrashreboot.com/plugin-example.html",
            "title": "Everything you want to know about Lorem Ipsum"
        },
        { 
            "text": "Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.",
            "tags": "Example Category",
            "img":,
            "url" : "http://oncrashreboot.com/plugin-example-2.html",
            "title": "Review of the book Lorem Ipsum"
        }
    ]
}
```

JSON is written to file `tipuesearch_content.js` which is created in the root of `output` directory.

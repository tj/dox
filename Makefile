
PREFIX = /usr/local

install:
	mkdir -p ~/.node_libraries
	cp -f bin/dox $(PREFIX)/bin/dox
	cp -fr lib/dox ~/.node_libraries/dox

uninstall:
	rm -f $(PREFIX)/bin/dox
	rm -fr ~/.node_libraries/dox

docs: uninstall install
	dox --ribbon "http://github.com/visionmedia/dox" \
		--title "Dox" \
		--desc "JavaScript documentation parser for [node](http://ndoejs.org).\
		Check out the [Github Repo](http://github.com/visionmedia/dox) for the \
		source and installation guide." \
		lib/dox/*.js > index.html

.PHONY: install uninstall docs
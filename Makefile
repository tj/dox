
DOCS = lib/dox.js
JSON = $(DOCS:.js=.json)
HTML = $(DOCS:.js=.html)

test:
	@./node_modules/.bin/expresso \
	  -I support

docs: $(HTML) docs.css

docs.css: docs.styl
	stylus < $< > $@

%.json: %.js
	./bin/dox < $< > $@

%.html: %.json
	./compile.js < $< > $@

clean:
	rm -f $(HTML) $(JSON)

.PHONY: test clean
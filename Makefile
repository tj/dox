
TESTS = test/*.test.js
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--ui exports \
		--reporter $(REPORTER) \
		$(TESTS)

watch:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--ui exports \
		--reporter $(REPORTER) \
		--growl \
		watch
docs:
	@./bin/dox \
	  --verbose \
	  lib/* \
	  --out docs \
	  --title Dox \
	  --github visionmedia/dox \
	  --index index.md

doc-server:
	@./bin/dox \
		--server docs

.PHONY: test watch docs

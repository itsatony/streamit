test:
	./node_modules/.bin/mocha \
		--reporter spec \
		--timeout 4000

.PHONY: test
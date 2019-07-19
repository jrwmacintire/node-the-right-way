'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const parseRDF = require('../lib/parse-rdf.js');

const rdf = fs.readFileSync(`${__dirname}/pg16.rdf`);

describe('parseRDF', () => {
    it('should be a function', () => {
        expect(parseRDF).to.be.a('function');
    });

    it('should parse RDF content', () => {
        const book = parseRDF(rdf);
        expect(book).to.be.an('object');
        expect(book).to.have.a.property('id', 16);
        expect(book).to.have.a.property('title', 'Peter Pan');

        expect(book).to.have.a.property('authors')
            .that.is.an('array').with.lengthOf(1)
            .and.contains('Barrie, J. M. (James Matthew)');
            
        expect(book).to.have.a.property('subjects')
            .that.is.an('array').with.lengthOf(5)
            .and.contains('Fantasy literature')
            .and.contains('Pirates -- Fiction')
            .and.contains('Peter Pan (Fictitious character) -- Fiction')
            .and.contains('Never-Never Land (Imaginary place) -- Fiction')
            .and.contains('Fairies -- Fiction');
    });
})
function getConcepts() {
    return [
        {
            id: 'REPORTING_TYPE',
            name: 'Reporting type',
            section: 'DIMENSION_DESCRIPTOR'
        },
        {
            id: 'SERIES',
            name: 'SDG series',
            section: 'DIMENSION_DESCRIPTOR'
        },
        {
            id: 'REF_AREA',
            name: 'Reference area',
            section: 'DIMENSION_DESCRIPTOR'
        },
        {
            id: 'SDG_INDICATOR_INFO',
            name: '0. Indicator information',
            section: 'SDG_INDICATOR_INFO',
        },
        {
            id: 'SDG_GOAL',
            name: '0.a. Goal',
            section: 'SDG_INDICATOR_INFO',
        },
        {
            id: 'SDG_TARGET',
            name: '0.b. Target',
            section: 'SDG_INDICATOR_INFO',
        },
        {
            id: 'SDG_INDICATOR',
            name: '0.c. Indicator',
            section: 'SDG_INDICATOR_INFO',
        },
        {
            id: 'SDG_SERIES_DESCR',
            name: '0.d. Series',
            section: 'SDG_INDICATOR_INFO',
        },
        {
            id: 'META_LAST_UPDATE',
            name: '0.e. Metadata update',
            section: 'SDG_INDICATOR_INFO',
        },
        {
            id: 'SDG_RELATED_INDICATORS',
            name: '0.f. Related indicators',
            section: 'SDG_INDICATOR_INFO',
        },
        {
            id: 'SDG_CUSTODIAN_AGENCIES',
            name: '0.g. International organisations(s) responsible for global monitoring',
            section: 'SDG_INDICATOR_INFO',
        },
        {
            id: 'CONTACT',
            name: '1. Data reporter',
            section: 'CONTACT',
        },
        {
            id: 'CONTACT_ORGANISATION',
            name: '1.a. Organisation',
            section: 'CONTACT',
        },
        {
            id: 'CONTACT_NAME',
            name: '1.b. Contact person(s)',
            section: 'CONTACT',
        },
        {
            id: 'ORGANISATION_UNIT',
            name: '1.c. Contact Organisation Unit',
            section: 'CONTACT',
        },
        {
            id: 'CONTACT_FUNCT',
            name: '1.d. Contact Person Function',
            section: 'CONTACT',
        },
        {
            id: 'CONTACT_PHONE',
            name: '1.e. Contact Phone',
            section: 'CONTACT',
        },
        {
            id: 'CONTACT_MAIL',
            name: '1.f. Contact Mail',
            section: 'CONTACT',
        },
        {
            id: 'CONTACT_EMAIL',
            name: '1.g. Contact emails',
            section: 'CONTACT',
        },
        {
            id: 'IND_DEF_CON_CLASS',
            name: '2. Definition, concepts and classifications',
            section: 'IND_DEF_CON_CLASS',
        },
        {
            id: 'STAT_CONC_DEF',
            name: '2.a. Definition and concepts',
            section: 'IND_DEF_CON_CLASS',
        },
        {
            id: 'UNIT_MEASURE',
            name: '2.b. Unit of Measure',
            section: 'IND_DEF_CON_CLASS',
        },
        {
            id: 'CLASS_SYSTEM',
            name: '2.c. Classifications',
            section: 'IND_DEF_CON_CLASS',
        },
        {
            id: 'SRC_TYPE_COLL_METHOD',
            name: '3. Data source type and data collection method',
            section: 'SRC_TYPE_COLL_METHOD',
        },
        {
            id: 'SOURCE_TYPE',
            name: '3.a. Data sources',
            section: 'SRC_TYPE_COLL_METHOD',
        },
        {
            id: 'COLL_METHOD',
            name: '3.b. Data collection method',
            section: 'SRC_TYPE_COLL_METHOD',
        },
        {
            id: 'FREQ_COLL',
            name: '3.c. Data collection calendar',
            section: 'SRC_TYPE_COLL_METHOD',
        },
        {
            id: 'REL_CAL_POLICY',
            name: '3.d. Data release calendar',
            section: 'SRC_TYPE_COLL_METHOD',
        },
        {
            id: 'DATA_SOURCE',
            name: '3.e. Data providers',
            section: 'SRC_TYPE_COLL_METHOD',
        },
        {
            id: 'COMPILING_ORG',
            name: '3.f. Data compilers',
            section: 'SRC_TYPE_COLL_METHOD',
        },
        {
            id: 'INST_MANDATE',
            name: '3.g. Institutional Mandate',
            section: 'SRC_TYPE_COLL_METHOD',
        },
        {
            id: 'OTHER_METHOD',
            name: '4. Other methodological considerations',
            section: 'OTHER_METHOD',
        },
        {
            id: 'RATIONALE',
            name: '4.a. Rationale',
            section: 'OTHER_METHOD',
        },
        {
            id: 'REC_USE_LIM',
            name: '4.b. Comment and limitations',
            section: 'OTHER_METHOD',
        },
        {
            id: 'DATA_COMP',
            name: '4.c. Method of computation',
            section: 'OTHER_METHOD',
        },
        {
            id: 'DATA_VALIDATION',
            name: '4.d. Validation',
            section: 'OTHER_METHOD',
        },
        {
            id: 'ADJUSTMENT',
            name: '4.e. Adjustments',
            section: 'OTHER_METHOD',
        },
        {
            id: 'IMPUTATION',
            name: '4.f. Treatment of missing values (i) at country level and (ii) at regional level',
            section: 'OTHER_METHOD',
        },
        {
            id: 'REG_AGG',
            name: '4.g. Regional aggregations',
            section: 'OTHER_METHOD',
        },
        {
            id: 'DOC_METHOD',
            name: '4.h. Methods and guidance available to countries for the compilation of the data at the national level',
            section: 'OTHER_METHOD',
        },
        {
            id: 'QUALITY_MGMNT',
            name: '4.i. Quality management',
            section: 'OTHER_METHOD',
        },
        {
            id: 'QUALITY_ASSURE',
            name: '4.j. Quality assurance',
            section: 'OTHER_METHOD',
        },
        {
            id: 'QUALITY_ASSMNT',
            name: '4.k. Quality assessment',
            section: 'OTHER_METHOD',
        },
        {
            id: 'COVERAGE',
            name: '5. Data availability and disaggregation',
            section: 'COVERAGE',
        },
        {
            id: 'COMPARABILITY',
            name: '6. Comparability/deviation from international standards',
            section: 'COMPARABILITY',
        },
        {
            id: 'OTHER_DOC',
            name: '7. References and Documentation',
            section: 'OTHER_DOC',
        },
    ]
}

function getConcept(findId) {
    const concept = getConcepts().find(concept => concept.id === findId)
    if (!concept) {
        console.log(`WARNING: Concept with id "${findId}" cannot be found in concept-store.js.`)
    }
    else {
        return concept
    }
}

function getConceptIdByName(findName) {
    const concept = getConcepts().find(concept => concept.name === findName)
    if (!concept) {
        console.log(`WARNING: Concept with name "${findName}" cannot be found in concept-store.js.`)
    }
    else {
        return concept.id
    }
}

function getConceptNameById(findId) {
    const concept = getConcepts().find(concept => concept.id === findId)
    if (!concept) {
        console.log(`WARNING: Concept with id "${findId}" cannot be found in concept-store.js.`)
    }
    else {
        return concept.name
    }
}

function getSectionIds() {
    return getConcepts()
        .filter(concept => concept.id === concept.section)
        .map(concept => concept.id)
}

function getConceptIdsBySectionId(findSection) {
    return getConcepts()
        .filter(concept => concept.section === findSection)
        .map(concept => concept.id)
}

function getConceptIds() {
    return getConcepts().map(concept => concept.id)
}

module.exports = {
    getConcepts,
    getConcept,
    getConceptIdByName,
    getConceptNameById,
    getSectionIds,
    getConceptIdsBySectionId,
    getConceptIds,
}

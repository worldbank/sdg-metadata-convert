const path = require('path')
const WordTemplateInput = require('../lib/input/WordTemplateInput')
const { expect } = require('chai')

const wordInput = new WordTemplateInput()
const wordInputFiles = [
  'SDG_Metadata_Authoring_Tool__Word_v2__detail_only.docx',
  'SDG_Metadata_Authoring_Tool__Word_v2.1.docx',
  'SDG_Metadata_Authoring_Tool__Word_v2.2.docx',
  'SDG_Metadata_Authoring_Tool__Word_v2.3.docx',
  'SDG_Metadata_Authoring_Tool__Word_v2.4.docx',
  'SDG_Metadata_Authoring_Tool__Word_v2.5.docx',
  'SDG_Metadata_Authoring_Tool__Word_v3.0.docm',
]
for (const wordInputFile of wordInputFiles) {
  describe(wordInputFile, function() {
    it('should import the required and expected metadata', async () => {
      const metadata = await wordInput.read(path.join('test', 'inputs', wordInputFile))
      expect(testMetadata(metadata)).to.be.true
    })
  })
}

function testMetadata(metadata) {

  const expectedDescriptors = getExpectedDescriptors()
  const expectedConcepts = getExpectedConcepts()

  for (const descriptorId in expectedDescriptors) {
    const descriptor = metadata.getDescriptor(descriptorId)
    if (descriptor !== '' && descriptor !== expectedDescriptors[descriptorId]) {
      throw Error('Descriptor ' + descriptorId + ' incorrect or missing.')
    }
  }
  for (const conceptId in expectedConcepts) {
    const concept = metadata.getConcept(conceptId)
    if (concept !== '' && concept !== expectedConcepts[conceptId]) {
      throw Error('Concept ' + conceptId + ' incorrect or missing.')
    }
  }

  return true
}

function getExpectedConcepts() {
  return {
    SDG_INDICATOR_INFO: '<p>1</p>',
    SDG_GOAL: '<p>2</p>',
    SDG_TARGET: '<p>3</p>',
    SDG_INDICATOR: '<p>4</p>',
    SDG_SERIES_DESCR: '<p>5</p>',
    META_LAST_UPDATE: '<p>6</p>',
    SDG_RELATED_INDICATORS: '<p>7</p>',
    SDG_CUSTODIAN_AGENCIES: '<p>8</p>',
    CONTACT: '<p>9</p>',
    CONTACT_ORGANISATION: '<p>10</p>',
    CONTACT_NAME: '<p>11</p>',
    ORGANISATION_UNIT: '<p>12</p>',
    CONTACT_FUNCT: '<p>13</p>',
    CONTACT_PHONE: '<p>14</p>',
    CONTACT_MAIL: '<p>15</p>',
    CONTACT_EMAIL: '<p>16</p>',
    IND_DEF_CON_CLASS: '<p>17</p>',
    STAT_CONC_DEF: '<p>18</p>',
    UNIT_MEASURE: '<p>19</p>',
    CLASS_SYSTEM: '<p>20</p>',
    SRC_TYPE_COLL_METHOD: '<p>21</p>',
    SOURCE_TYPE: '<p>22</p>',
    COLL_METHOD: '<p>23</p>',
    FREQ_COLL: '<p>24</p>',
    REL_CAL_POLICY: '<p>25</p>',
    DATA_SOURCE: '<p>26</p>',
    COMPILING_ORG: '<p>27</p>',
    INST_MANDATE: '<p>28</p>',
    OTHER_METHOD: '<p>29</p>',
    RATIONALE: '<p>30</p>',
    REC_USE_LIM: '<p>31</p>',
    DATA_COMP: '<p>32</p>',
    DATA_VALIDATION: '<p>33</p>',
    ADJUSTMENT: '<p>34</p>',
    IMPUTATION: '<p>35</p>',
    REG_AGG: '<p>36</p>',
    DOC_METHOD: '<p>37</p>',
    QUALITY_MGMNT: '<p>38</p>',
    QUALITY_ASSURE: '<p>39</p>',
    QUALITY_ASSMNT: '<p>40</p>',
    COVERAGE: '<p>41</p>',
    COMPARABILITY: '<p>42</p>',
    OTHER_DOC: '<p>43</p>'
  }
}

function getExpectedDescriptors() {
  return {
    REPORTING_TYPE: 'G',
    SERIES: 'SI_POV_DAY1',
    REF_AREA: '1',
    LANGUAGE: 'en'
  }
}

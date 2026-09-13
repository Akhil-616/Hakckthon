require('dotenv').config();
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

async function testJustification() {
  // Create a test file
  const testFile = Buffer.from('Test medical certificate content');
  fs.writeFileSync('/tmp/test-cert.txt', testFile);

  const formData = new FormData();
  formData.append('reason', 'Woke up late - testing justification submission');
  formData.append('file', fs.createReadStream('/tmp/test-cert.txt'), 'test-cert.txt');

  const response = await fetch('http://localhost:3000/api/students/STU001/justifications', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  console.log('Status:', response.status);
  console.log('Result:', JSON.stringify(result, null, 2));

  if (response.ok) {
    console.log('\n✓ Justification submitted successfully!');
    console.log('JustificationID:', result.justificationid);
  } else {
    console.log('\n✗ Submission failed:', result.error || result);
  }
}

testJustification().catch(console.error);

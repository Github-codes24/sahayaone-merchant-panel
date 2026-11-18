const fs = require('fs');

const files = [
    'src/pages/AddLead.jsx',
    'src/pages/AddClient.jsx',
    'src/pages/ClientDetails.jsx',
    'src/pages/ClientLoans.jsx',
    'src/pages/EditClient.jsx',
    'src/pages/LoanDetails.jsx',
];

const BUTTON_HTML = `<div className="flex items-center gap-3 mb-1">
          <button type="button" onClick={() => navigate(-1)} className="w-9 h-9 flex shrink-0 items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-[#2B4282] transition-colors border-none cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
`;

for (const path of files) {
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, 'utf8');
        if (content.includes('navigate(-1)')) {
            console.log('Skipping ' + path);
            continue;
        }
        
        // Find <h1 ...> ... </h1> and wrap it
        content = content.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/g, BUTTON_HTML + '          $1\n        </div>');
        fs.writeFileSync(path, content, 'utf8');
        console.log('Updated ' + path);
    }
}

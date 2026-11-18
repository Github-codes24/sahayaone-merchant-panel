import glob
import re

files = [
    'src/pages/AddClient.jsx',
    'src/pages/AddLead.jsx',
    'src/pages/ClientDetails.jsx',
    'src/pages/ClientLoans.jsx',
    'src/pages/EditClient.jsx',
    'src/pages/LoanDetails.jsx'
]

replacement = """<button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#2B4282] text-[13px] font-bold rounded-lg border border-gray-200 cursor-pointer transition-colors shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>"""

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to match the button
    pattern = r'<button\s+type="button"\s+onClick=\{\(\)\s*=>\s*navigate\(-1\)\}\s+className="w-9 h-9 flex shrink-0 items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-\[#2B4282\] transition-colors border-none cursor-pointer">\s*<svg[^>]*>\s*<path[^>]*/>\s*</svg>\s*</button>'
    
    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Replaced in {path}")
    else:
        print(f"Not found in {path}")

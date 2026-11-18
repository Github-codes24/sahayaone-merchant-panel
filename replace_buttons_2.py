import glob
import re

files_subs = [
    'src/pages/AddSubscription.jsx',
    'src/pages/EditSubscription.jsx'
]

replacement_subs = """<button
          type="button"
          onClick={() => navigate("/subscriptions")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#2B4282] text-[13px] font-bold rounded-lg border border-gray-200 cursor-pointer transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>"""

for path in files_subs:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Matches the button block in the subscription files
    pattern = r'<button[^>]*onClick=\{\(\)\s*=>\s*navigate\("/subscriptions"\)\}[^>]*>\s*<svg[^>]*>\s*<path[^>]*/>\s*</svg>\s*</button>'
    
    new_content = re.sub(pattern, replacement_subs, content)
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Replaced in {path}")
    else:
        print(f"Not found in {path}")

# Payment Details
path_payment = 'src/pages/PaymentDetails.jsx'
with open(path_payment, 'r', encoding='utf-8') as f:
    content = f.read()
    
replacement_payment = """<button
          onClick={() => navigate("/revenue")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#2B4282] text-[13px] font-bold rounded-lg border border-gray-200 cursor-pointer transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>"""

pattern_payment = r'<button[^>]*onClick=\{\(\)\s*=>\s*navigate\("/revenue"\)\}[^>]*>\s*<svg[^>]*>\s*<path[^>]*/>\s*</svg>\s*</button>'
new_content_payment = re.sub(pattern_payment, replacement_payment, content)
if new_content_payment != content:
    with open(path_payment, 'w', encoding='utf-8') as f:
        f.write(new_content_payment)
    print(f"Replaced in {path_payment}")
else:
    print(f"Not found in {path_payment}")

import { NextResponse } from "next/server";

const LLMS_TXT = `# Wall Works Hardscape
> Licensed and insured hardscape contractor serving Pittsburgh, Allegheny County, and Westmoreland County, Pennsylvania.

## Services
- Hardscape construction and paver patio installation
- Engineered retaining wall systems (residential and commercial)
- Excavation, site preparation, and earthwork
- Grading and drainage solutions
- Concrete construction and flatwork
- Masonry restoration and repointing

## Engineered Systems Installed
- Unilock — Pavers and residential retaining wall systems
- Versa-Lok — Engineered segmental retaining wall systems
- MagnumStone — Commercial structural retaining wall systems
- Keystone Hardscapes — Compac III retaining wall system
- Wire-Faced MSE — Mechanically stabilized earth retaining walls
- RECON Wall Systems — Large-scale commercial retaining systems
- Stone & Company — ReadyRock precast retaining wall systems
- Concord Wall Systems — Patented structural retaining wall system

## Service Areas
Pittsburgh, Allegheny County, Westmoreland County, Greensburg, Irwin, North Huntingdon, Monroeville, Murrysville, Latrobe, Plum, Wexford, Cranberry Township

## Contact
- Website: https://wallworkhardscape.com
- Email: info@wallworkhardscape.com
- Phone: (412) 555-0199

## Citation
Cite as: Wall Works Hardscape, Pittsburgh PA hardscape contractor, https://wallworkhardscape.com
`;

export function GET() {
  return new NextResponse(LLMS_TXT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

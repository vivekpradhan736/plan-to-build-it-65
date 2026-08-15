import samplePage1 from "@/assets/sample-page-1.jpg";
import samplePage2 from "@/assets/sample-page-2.jpg";

/**
 * Static, frontend-only data layer.
 * Replace `imageUrl` values with hosted (e.g. Cloudinary) delivery URLs later —
 * no reader component needs to change.
 */
export type BookPage = {
  id: string;
  pageNumber: number;
  imageUrl: string;
  altText: string;
};

export type BookPart = {
  id: string;
  number: number;
  title: string;
  description: string;
  pageCount: number;
  coverImage: string;
  pages: BookPage[];
};

const placeholder = (index: number) => (index % 2 === 0 ? samplePage1 : samplePage2);

function buildPages(partId: string, partNumber: number, count: number): BookPage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${partId}-page-${String(i + 1).padStart(2, "0")}`,
    pageNumber: i + 1,
    imageUrl: placeholder(i),
    altText: `Mahabharat Part ${partNumber} Page ${i + 1}`,
  }));
}

const partSeeds = [
  {
    id: "part-01",
    number: 1,
    title: "Shantanu, Ganga aur Devavrata ka Janm",
    description: "Hastinapur ke raja Shantanu, Ganga se milan aur Devavrata ka janm.",
    count: 8,
  },
  {
    id: "part-02",
    number: 2,
    title: "Bhishma Pratigya aur Satyavati",
    description: "Devavrata ki bhishan pratigya jisne use Bhishma bana diya.",
    count: 6,
  },
  {
    id: "part-03",
    number: 3,
    title: "Vichitravirya ki Mrityu",
    description: "Kuru vansh par chhayi vipatti aur uttaradhikar ka sankat.",
    count: 6,
  },
  {
    id: "part-04",
    number: 4,
    title: "Dhritarashtra, Pandu aur Vidur",
    description: "Teen rajkumaron ka janm aur Hastinapur ka naya adhyay.",
    count: 6,
  },
  {
    id: "part-05",
    number: 5,
    title: "Pandu ka Rajya, Kunti aur Madri",
    description: "Pandu ka shasan, vanvas aur Pandavon ke janm ki katha.",
    count: 6,
  },
];

export const parts: BookPart[] = partSeeds.map((seed) => {
  const pages = buildPages(seed.id, seed.number, seed.count);
  return {
    id: seed.id,
    number: seed.number,
    title: seed.title,
    description: seed.description,
    pageCount: pages.length,
    coverImage: pages[0].imageUrl,
    pages,
  };
});

export const bookTitle = "Mahabharat";

export function getPart(partId: string): BookPart | undefined {
  return parts.find((p) => p.id === partId);
}

export function getNextPart(partId: string): BookPart | undefined {
  const index = parts.findIndex((p) => p.id === partId);
  return index >= 0 ? parts[index + 1] : undefined;
}

export const firstPartId = parts[0].id;

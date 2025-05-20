
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = {
    all: [
      {
        id: 1,
        src: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=3024&auto=format&fit=crop",
        alt: "Blood Donation Camp",
        category: "cmd"
      },
      {
        id: 2,
        src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=3000&auto=format&fit=crop",
        alt: "Daan Utsav",
        category: "cmd"
      },
      {
        id: 3,
        src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=3540&auto=format&fit=crop",
        alt: "Orientation Session",
        category: "csd"
      },
      {
        id: 4,
        src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=3540&auto=format&fit=crop",
        alt: "Tree Plantation Drive",
        category: "cmd"
      },
      {
        id: 5,
        src: "https://images.unsplash.com/photo-1559223607-a43f990c67bd?q=80&w=3540&auto=format&fit=crop",
        alt: "International Cultural Exchange",
        category: "isd"
      },
      {
        id: 6,
        src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=3540&auto=format&fit=crop",
        alt: "Resume Building Workshop",
        category: "pdd"
      },
      {
        id: 7,
        src: "https://images.unsplash.com/photo-1607988795691-3d0147b43231?q=80&w=3540&auto=format&fit=crop",
        alt: "Visit to Orphanage",
        category: "cmd"
      },
      {
        id: 8,
        src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=3540&auto=format&fit=crop",
        alt: "Annual Meetup",
        category: "csd"
      },
      {
        id: 9,
        src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=3540&auto=format&fit=crop",
        alt: "Team Building Activity",
        category: "csd"
      },
      {
        id: 10,
        src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=3540&auto=format&fit=crop",
        alt: "Professional Development Workshop",
        category: "pdd"
      },
      {
        id: 11,
        src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=3432&auto=format&fit=crop",
        alt: "Club Members",
        category: "csd"
      },
      {
        id: 12,
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3540&auto=format&fit=crop",
        alt: "Team Meeting",
        category: "csd"
      }
    ],
  };

  const getFilteredImages = (category: string) => {
    if (category === "all") {
      return images.all;
    } else {
      return images.all.filter(image => image.category === category);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Gallery" 
        subtitle="Moments captured at various Rotaract MUJ events" 
        backgroundImage="https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?q=80&w=3542&auto=format&fit=crop"
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="csd">CSD</TabsTrigger>
              <TabsTrigger value="cmd">CMD</TabsTrigger>
              <TabsTrigger value="isd">ISD</TabsTrigger>
              <TabsTrigger value="pdd">PDD</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredImages("all").map((image) => (
                  <div 
                    key={image.id} 
                    className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="csd" className="mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredImages("csd").map((image) => (
                  <div 
                    key={image.id} 
                    className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cmd" className="mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredImages("cmd").map((image) => (
                  <div 
                    key={image.id} 
                    className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="isd" className="mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredImages("isd").map((image) => (
                  <div 
                    key={image.id} 
                    className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pdd" className="mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredImages("pdd").map((image) => (
                  <div 
                    key={image.id} 
                    className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
          <div className="relative">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <X className="h-5 w-5" />
            </button>
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="w-full h-auto rounded"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;

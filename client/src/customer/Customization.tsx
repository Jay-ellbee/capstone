import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
//import Footer from '@/components/Footer'; // Reusable footer component
import HeaderFP from '@/components/HeaderFP';
import Footer from '@/components/FooterFP';
import { CheckCircle, Download, Image, Images, ImageUp, SendHorizonal, Wand } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"

const Customization: React.FC = () => {
  const [textPrompt, setTextPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
  
    try {
      // Payload matching backend structure
      const payload = { text: textPrompt };
  
      if (!textPrompt.trim()) {
        setError("Text prompt cannot be empty.");
        setLoading(false);
        return;
      }
  
      console.log("Payload:", payload); // Debug payload
  
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(`Failed to generate image: ${response.statusText}`);
      }
  
      const { image } = await response.json();
      setGeneratedImage(image);
      console.log("Image generated successfully:", image);
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
      {/*Config ng wide screen na navigation */}
      <HeaderFP />
      <main className="container mx-auto p-3 md: px-60">
          <div className="text-center text-4xl font-semibold my-10">
            <h1>Customization Page</h1>
          </div>
          <Tabs >
          <div className="flex items-center">
          <TabsList defaultValue="tti"> 
                <TabsTrigger value="tti">Text-to-Image</TabsTrigger>
                <TabsTrigger value="florist">Direct to Florist</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
              </div>
            </div>
            <TabsContent value="tti">
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  {/* Left Column: Input Area */}
                  <div className="col-span-1">
                    <textarea
                      placeholder="Type a detailed description of your desired arrangement."
                      name="notes"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      className="w-full p-3 border rounded-sm"
                      rows={10}
                    />
                    <div className="grid grid-cols-3">
                      <div className="col-span-2"></div>
                      <Button onClick={handleGenerate} disabled={loading} className="col-span-1">
                        {loading ? "Generating..." : "Generate"}
                        <Wand className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <Accordion type="single" collapsible className="w-full mt-6 mb-2">
                      <h1 className="font-semibold text-2xl">FAQs</h1>
                      <AccordionItem value="item-1">
                        <AccordionTrigger> What is the Text-to-Image Feature?</AccordionTrigger>
                        <AccordionContent>
                        The Text-to-Image feature is an innovative tool that allows you to bring your creative ideas to life. By simply describing the arrangement or design you envision, the AI generates an image based on your input. Whether it&apos;s a bouquet for a special occasion or a unique floral concept, this feature is designed to make customization effortless and personalized.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How Do I Use the Text-to-Image Feature?</AccordionTrigger>
                        <AccordionContent>
                        To use this feature, start by navigating to the customization page for your desired product. Enter a detailed description of your envisioned design, specifying colors, themes, or particular elements you want included. Once you&apos;ve entered your prompt, click "Generate Image" to see the AI&apos;s interpretation. If you&apos;re satisfied with the result, you can download the image and send your request through our contact us page to process your order.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>What Should I Keep in Mind When Using This Feature?</AccordionTrigger>
                        <AccordionContent>
                        For the best results, ensure your prompts are descriptive and precise. For example, instead of writing "a nice bouquet," opt for "a bouquet of red roses and white lilies with a gold ribbon." Avoid overly vague or complex descriptions, as this may result in less accurate designs. After submitting your request, the florist will review the design and contact you for any necessary clarifications or adjustments.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* Right Column: Generated Image */}
                  <div className="col-span-1">
                        <div className="border-2 border-dashed shadow-md h-auto flex justify-center items-center overflow-hidden">
                          {generatedImage ? (
                            <img
                              src={generatedImage}
                              alt="Generated"
                              className="h-full max-h-full w-full max-w-full object-contain border rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-500">No image generated yet.</span>
                          )}
                        </div>
                        <div className="flex flex-row gap-2 my-2">
                          <Button
                            className="bg-gray-200 rounded-full text-black hover:text-white ml-auto"
                            onClick={() => {
                              if (generatedImage) {
                                const a = document.createElement("a");
                                a.href = generatedImage;
                                a.download = "generated_image.png";
                                a.click();
                              }
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button className="bg-gray-200 rounded-full text-black hover:text-white">
                            <Images className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                    </div>
              </TabsContent>


            <TabsContent value="florist">
            <div>
                <textarea
                  placeholder="Type a detailed description of your desired arrangement."
                  name="notes"
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  className="w-full p-3 border rounded-sm"
                  rows={10}
                />
                <div className="flex flex-row gap-2 my-2">
                  {/* Button for Drag-and-Drop Upload Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gray-200 rounded-full text-black hover:text-white">
                        <ImageUp className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Upload an Image</DialogTitle>
                        <DialogDescription>
                          Drag and drop your file or click to browse.
                        </DialogDescription>
                      </DialogHeader>
                      <div
                        className="border-dashed border-2 rounded-md p-6 flex flex-col items-center justify-center"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer text-center text-muted-foreground"
                        >
                          Drag & Drop your file here or click to upload
                        </label>
                        {uploadedFile && (
                          <p className="mt-2 text-sm text-foreground">
                            Uploaded: {uploadedFile.name}
                          </p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setUploadedFile(null)}
                          className="mr-auto"
                        >
                          Clear
                        </Button>
                        <DialogClose asChild>
                          <Button>Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Button for Sending Request */}
                  <Button className="bg-gray-200 rounded-full text-black hover:text-white ml-auto">
                    <SendHorizonal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Accordion type="single" collapsible className="w-full mt-6 mb-2">
                      <h1 className="font-semibold text-2xl">FAQs</h1>
                      <AccordionItem value="item-1">
                        <AccordionTrigger> What is the Text-to-Image Feature?</AccordionTrigger>
                        <AccordionContent>
                        The Text-to-Image feature is an innovative tool that allows you to bring your creative ideas to life. By simply describing the arrangement or design you envision, the AI generates an image based on your input. Whether it&apos;s a bouquet for a special occasion or a unique floral concept, this feature is designed to make customization effortless and personalized.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How Do I Use the Text-to-Image Feature?</AccordionTrigger>
                        <AccordionContent>
                        To use this feature, start by navigating to the customization page for your desired product. Enter a detailed description of your envisioned design, specifying colors, themes, or particular elements you want included. Once you&apos;ve entered your prompt, click "Generate Image" to see the AI&apos;s interpretation. If you&apos;re satisfied with the result, you can download the image and send your request through our contact us page to process your order.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>What Should I Keep in Mind When Using This Feature?</AccordionTrigger>
                        <AccordionContent>
                        For the best results, ensure your prompts are descriptive and precise. For example, instead of writing "a nice bouquet," opt for "a bouquet of red roses and white lilies with a gold ribbon." Avoid overly vague or complex descriptions, as this may result in less accurate designs. After submitting your request, the florist will review the design and contact you for any necessary clarifications or adjustments.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
              </TabsContent>
          </Tabs>

      </main>
      <Footer />
    </div>
  );
};


export default Customization;

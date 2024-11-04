import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeaderFP from "@/components/HeaderFP";
import Footer from "@/components/FooterFP";
import { ArrowRight, Search, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from '@/components/ui/label';



const Services: React.FC = () => {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:py-0">
        <HeaderFP />
        <main className="container mx-auto my-5 p-3 lg:px-20">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-semibold mb-6">Services</h1>
            </div>
            <Tabs defaultValue="funeral" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-rose-200 h-12">
                <TabsTrigger value="funeral">Funeral Set Up</TabsTrigger>
                <TabsTrigger value="box">Box Arrangement</TabsTrigger>
                <TabsTrigger value="reception">Reception Styling</TabsTrigger>
                <TabsTrigger value="vip">Reception VIP and Guest Table</TabsTrigger>
              </TabsList>
              <TabsContent value="funeral">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <Card className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                  style={{
                    backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/10000-1.jpg')",
                  }}
                >
                </Card>
                <Card className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                  style={{
                    backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/15000.jpg')",
                  }}
                >
                </Card>
                <Card
                  className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                  style={{
                    backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/25000.jpg')",
                  }}
                >
                </Card>
                <Card
                  className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                  style={{
                    backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/26000.jpg')",
                  }}
                >
                </Card>
                <Card
                  className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                  style={{
                    backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/28000.jpg')",
                  }}
                >
                </Card>
                <Card
                  className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                  style={{
                    backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/300001.jpg')",
                  }}
                >
                </Card>
                </div>
              </TabsContent>
              <TabsContent value="box">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/65001.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/6500.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/10500.jpg')",
                    }}
                  >
                  </Card>
                  </div>
              </TabsContent>
              <TabsContent value="reception">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-1c0c192ca221ee09453a1df190ee379e3542dc22e106b08e9e002c86f3ba2998_8ce2670d123f402b.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-3b15e11e89466aa78de0a66f6c61b3ace0ada5f49d23abb326a0a2ce84195eea_c9bb05751c2e177b.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-5b954b89553d0b50a1fd51b661e6e4e81ae16dfb2cfc6b5fa5920935ff6125bb_8e0af4696e93bcf8.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-5bb2acc083869621c3b8e22eb986d3f9a74e2b83e5556d8cedd60d2597780058_1d7793c0ef3db167.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-6ae609c3edcff3cc0a73b9e431b52a8df4fa13fedceb2ec2787a4cb5e5edf82d_349d5dac9a6e51b8.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-957d0ffb589b9d5b5eadbc3d34c491540f2f7baec804e47922a9dec822e339d2_c9e108937d0b12d4.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/viber_image_2024-06-06_12-57-59-105.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/viber_image_2024-06-06_12-57-59-257.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/viber_image_2024-06-06_12-57-59-309.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/viber_image_2024-06-06_12-57-59-373.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/viber_image_2024-06-06_12-57-59-513.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/viber_image_2024-06-06_12-57-59-582.jpg')",
                    }}
                  >
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="vip">
                <div className="grid grid-cols-3 gap-4 p-4">
                <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-6c6d2a17d7f406ec3cfa3d323378d90fb5edd651dd99fa4f8472cd922830782e_a825b115a6657667.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-6cc1eb9a36a20aad074d36ccf771a80fbfdcd69564b25b04ea918648605673cb_4d741dc4141ebb2f.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-19dfdc3a6fb02ec2ee57869120e5ad27b5587d29926c46372b89b4659e74db42_83c7a80b41e84291.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-6459f0387aa9813d5ed91a3a7e9e9486af071cd588b5555ec2b2614fafd9e401_f468f914720f7c6c.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-15527bb3af314885745e973a5f9273dcf88716bd757b97e824516ee0f5bd4b0f_719c5b4ed5a5da76.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-27650ff2c447735644e475124de9aae0f25fa5af9b7e79f719582ef0d91ea14d_861e151309c172d.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-300456b7a1409e81001c716280165bbbd68bb35e99063007b5a2b37ccb9ce45e_10e95c0311a83b1f.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-877007d910b28de6006ccd776d1a9c45a34a71d91b7868886ebd516ccadfb807_7b676d89c38f57a6.jpg')",
                    }}
                  >
                  </Card>
                  <Card
                    className="h-72 overflow-hidden bg-cover bg-center rounded-lg hover:shadow-xl"
                    style={{
                      backgroundImage: "url('https://bloomsbouquetph.com/wp-content/uploads/2024/06/0-02-06-724333044660f04349394b801ac79f941062f4f21874f631783b92571a88e79c_478f6ab08d1046c1.jpg')",
                    }}
                  >
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            <div className="relative bg-[url('/flower-bg.jpg')] bg-no-repeat bg-cover bg-center rounded-lg h-80 my-16">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent rounded-lg"></div>

          {/* Content */}
          <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 z-10 text-center">
            <h2 className="text-4xl font-bold text-white">Interested in these designs?</h2>
            <p className="text-lg text-white mt-2">Contact Us to arrange yours!</p>
            <Link to="/contact-us">
            <Button className="mt-4 px-4 py-2 backdrop-blur-lg bg-white/30 text-rose-700 rounded-lg" variant="outline">Message Us!</Button></Link>
          </div>

      </div>
        </main>
        <Footer />
      </div>
    );
  };
  
  export default Services;
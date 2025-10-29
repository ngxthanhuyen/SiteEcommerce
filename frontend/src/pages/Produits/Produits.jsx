import React from 'react'
import ProduitsBanners from '../../components/ProduitsBanners/ProduitsBanners';
import Offer from '../../components/Offer/Offer';
import SkincareBestseller from '../../components/SkincareBestseller/SkincareBestSeller';
import ProduitsSection from '../../components/ProduitsSection/ProduitsSection';
import {produitsSection} from '../../data/data';
import { Footer } from '../../components/Footer/Footer';

const soldes = produitsSection.slice(0,3);
const nouveautes = produitsSection.slice(3);

const Produits = () => {
  return (
    <>
        <ProduitsBanners/>
        <Offer />
        <SkincareBestseller/>
        <ProduitsSection title="Soldes de saison" products={soldes} offset={0} />
        <ProduitsSection title="Nouveautés" products={nouveautes} offset={soldes.length} />
        <Footer />
    </>
  )
}
export default Produits;
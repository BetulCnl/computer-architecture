# PcRL: Etkileşimli Bilgisayar Mimarisi Laboratuvarı

Bilgisayar donanımını ve bilgisayar mimarisi dersini tarayıcıda anlatan bir eğitim sitesi. İki bölümden oluşuyor:

- **3D laboratuvar:** İşlemci, ekran kartı, DDR5 RAM, NVMe SSD, ATX anakart ve kule tipi soğutucu modelleri. Modeller hazır bir 3D dosyadan yüklenmiyor, hepsi kodla (Three.js) oluşturuluyor.
- **Ders notları:** Bilgisayar mimarisi konularını anlatan 10 ders. Her derste metin, adım adım oynatılabilen animasyonlar ve kısa bir test var.

Canlı site: [betulcnl.github.io/computer-architecture](https://betulcnl.github.io/computer-architecture/)

## Laboratuvarda neler var

- Modeli döndürüp parçaların üzerine gelince vurgulama, tıklayınca o parçayla ilgili açıklama
- Patlatılmış görünüm: parçalar katman katman ayrılır
- Veri akışı simülasyonu: SSD'den NAND'e, PCIe'den GPU'ya, RAM ile CPU arasında akan parçacıklar; soğutucuda ısının yükselişi ve dönen fanlar
- 9 bölümlük rehberli tur ("verinin yolculuğu"), kamera kendiliğinden hareket eder
- Bilgisayarın gücüne göre otomatik ayarlanan grafik kalitesi (ultra / high / medium / low), elle de değiştirilebilir

Klavye kısayolları:

| Tuş | İşlev |
|---|---|
| `1`–`6` | model değiştir |
| `E` | patlatılmış görünümü aç/kapat |
| `Space` | simülasyonu başlat |
| `←` / `→` | turda önceki / sonraki bölüm |
| `Esc` | paneli kapat, turdan çık |

## Dersler

1. Giriş (katmanlı model, CISC/RISC, Von Neumann ve Harvard, komut çevrimi, performans)
2. İş hattı (pipeline) ve dallanma tahmini
3. Giriş/çıkış organizasyonu ve yol erişimi
4. Kesmeler ve yol hakemliği (bus arbitration)
5. DMA
6. Cep bellek (cache): bellek hiyerarşisi, eşleme yöntemleri, yazma politikaları
7. Dış bellek ve RAID, Hamming kodu
8. Bellek yönetimi ve sanal bellek
9. Çok işlemcili sistemler, cep bellek tutarlılığı, Amdahl yasası
10. Kayan noktalı sayılar (IEEE 754)

Bir derse doğrudan bağlantı verilebilir: `#/ders/<id>`.

## Teknolojiler

React 19, React Three Fiber, drei, @react-three/postprocessing, zustand, TypeScript, Vite, Vitest, ESLint.

## Geliştirme

```bash
npm install
npm run dev        # geliştirme sunucusu
npm run test       # Vitest: modellerin yapısal testleri
npm run lint
npm run build      # tip kontrolü + üretim derlemesi
```

`main` dalına her push'ta GitHub Actions testleri çalıştırıp siteyi GitHub Pages'e yüklüyor (`.github/workflows/deploy.yml`).

## Klasör yapısı

```
src/
  models/     her donanım için bir üretici fonksiyon; ModelView hepsini aynı şekilde çizer
  content/    laboratuvardaki açıklama metinleri ve tur bölümleri
  lessons/    ders görünümü, test bileşeni
    content/  dersin metinleri (01-giris.ts ... 10-kayan-noktali.ts)
    viz/      derslerdeki etkileşimli animasyonlar
  core/       geometri yardımcıları, ışıklandırma, bloom efekti
  materials/  ortak malzemeler
  systems/    kamera hareketlerinin tamamı (CameraDirector)
  state/      zustand store'ları
  ui/         HUD, bilgi paneli, tur paneli, kenar çubuğu
  scenes/     laboratuvar sahnesi
```

## Yeni şey eklemek

**Yeni donanım modeli:** `src/models/<isim>/generate.ts` içinde parçaları ve her parçanın `{ id, name, contentKey, explodeVector, annotationAnchor }` bilgisini döndüren bir fonksiyon yaz, `src/content/` altına açıklama dosyasını ekle, `src/models/registry.ts`'e ve `src/state/app.ts` içindeki `ComponentId` tipine ekle. Patlatma, vurgulama ve kamera odaklama bu bilgilerden otomatik çalışır.

**Yeni ders:** `src/lessons/content/` altına sıradaki numarayla bir `.ts` dosyası eklemek yeterli, kenar çubuğu dersi kendisi bulur.

Ayrıca proje kökünde `itu_dersNotlari/` diye bir klasör varsa, Vite içindeki alt klasörleri tarar. İçeriği henüz yazılmamış her klasör kenar çubuğunda "hazırlanıyor" olarak görünür. Bu klasör repoda yok, yerelde tutuluyor.

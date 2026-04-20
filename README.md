Šis projekts ir balstīts uz kāršu spēli "Troika", jeb angliski "shit-head"!

Projekt mērķis bija izstrādāt spēli, kuru var spēlēt divi 2 cilvēki vienlaicīgi "online", bet tas vēl nav izdarīts.

Šobrīd šo spēli var spēlēt uz viena datora uz viena ekrāna divi cilvēki, redzot viens otra kārtis, kas nav īsti interesanti.

Projekts ir vedots tikai un vienīgi ar "Laravel" un "Javascript", tāpēc to ir vienkārši noklonēt un palaist uz savas ierīces.

Soļi, kā dabūt šo projektu sev lokāli (iepriekšejas zināšanas ir nepieciešamas):

1. Sevis izvēlētajā mapē, caur termināli palaist šo komandu - git clone https://github.com/Marsels-Str/CardGame.git
2. Tad atvērt šo projektu ar - cd "un projekta nosaukums", "lai redzētu visas mapes, kas atrodas iekšā izvēlētajā izmantot" - ls
3. Tad vienkārši izpildīt secīgi - composer install "un" npm install

Lai iegūtu datubāzi atvērt projektu caur koda redaktoru (Visual studio code) un nokopēt .env.example failu vai vienkārši pārsaukt to par .env un atkomentēt datubāzes sadaļu (DB).
1. Tad terminālī - php artisan migrate
2. Lai palaistu projektu - composer run dev

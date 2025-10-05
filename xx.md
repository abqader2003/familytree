graph TD

%% المستوى الأعلى: KEM API
A1[crypto_kem_keypair] --> B1[indcpa_keypair]
A1 --> B2[hash_h]
A1 --> B3[randombytes]

A2[crypto_kem_enc] --> B4[randombytes]
A2 --> B5[hash_h]
A2 --> B6[hash_g]
A2 --> B7[indcpa_enc]
A2 --> B8[kdf]

A3[crypto_kem_dec] --> B9[indcpa_dec]
A3 --> B6
A3 --> B7
A3 --> B10[verify]
A3 --> B11[cmov]
A3 --> B2
A3 --> B8

%% indcpa.c Keypair
B1 --> C1[gen_matrix]
B1 --> C2[poly_getnoise]
B1 --> C3[polyvec_ntt]
B1 --> C4[polyvec_pointwise_acc]
B1 --> C5[poly_frommont]
B1 --> C6[polyvec_add]
B1 --> C7[polyvec_reduce]
B1 --> C8[pack_sk]
B1 --> C9[pack_pk]

C1 --> D1[xof_absorb]
C1 --> D2[xof_squeezeblocks]
C1 --> D3[rej_uniform]

%% indcpa_enc
B7 --> C10[unpack_pk]
B7 --> C11[poly_frommsg]
B7 --> C12[gen_at]
B7 --> C13[poly_getnoise]
B7 --> C3
B7 --> C4
B7 --> C14[polyvec_invntt]
B7 --> C15[poly_invntt]
B7 --> C6
B7 --> C16[poly_add]
B7 --> C7
B7 --> C17[pack_ciphertext]

C10 --> D4[polyvec_frombytes]
D4 --> E1[poly_frombytes]

C17 --> D5[polyvec_compress]
C17 --> D6[poly_compress]
D5 --> E2[poly_csubq]
D6 --> E3[polyvec_csubq]

%% indcpa_dec
B9 --> C18[unpack_ciphertext]
B9 --> C19[unpack_sk]
B9 --> C3
B9 --> C4
B9 --> C15
B9 --> C20[poly_sub]
B9 --> C7
B9 --> C21[poly_tomsg]

C18 --> D7[polyvec_decompress]
C18 --> D8[poly_decompress]
C19 --> D4

%% NTT + Polynomial arithmetic
C3 --> F1[poly_ntt]
C15 --> F2[poly_invntt]
F1 --> G1[ntt]
F2 --> G2[invntt]
G1 --> H1[ntt_2]
G2 --> H2[invntt_2]

C4 --> F3[poly_basemul]
F3 --> G3[basemul]
G3 --> H3[fqmul]
H3 --> I1[montgomery_reduce]

C5 --> I1
C7 --> I2[barrett_reduce]
C16 --> I3[poly_add]

%% Hashing & Randomness
B1 --> J1[hash_g]
B1 --> J2[randombytes]
B1 --> J3[kyber_shake128_absorb]
B1 --> J4[kyber_shake128_squeezeblocks]
B1 --> J5[rej_uniform]
B1 --> J6[prf]
J6 --> J7[shake256_prf]
J7 --> J8[shake256]

C2 --> K1[cbd]
C2 --> J7

%% Utilities
B9 --> L1[barrett_reduce]
B9 --> L2[poly_decompress]
B9 --> L3[polyvec_decompress]

B8 --> M1[hash_h]
B10 --> M2[verify]
B11 --> M3[cmov]

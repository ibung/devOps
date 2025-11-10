<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Dokumen</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light p-4">
<div class="container">
    <h2 class="mb-4">Upload Dokumen ke MinIO</h2>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $err)
                    <li>{{ $err }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('dokumen.store') }}" method="POST" enctype="multipart/form-data" class="mb-4">
        @csrf

        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label" for="judul">Judul</label>
                <input type="text" name="judul" id="judul" class="form-control" required>
            </div>

            <div class="col-md-3">
                <label class="form-label" for="nomor_dokumen">Nomor Dokumen</label>
                <input type="text" name="nomor_dokumen" id="nomor_dokumen" class="form-control">
            </div>

            <div class="col-md-3">
                <label class="form-label" for="tanggal_terbit">Tanggal Terbit</label>
                <input type="date" name="tanggal_terbit" id="tanggal_terbit" class="form-control">
            </div>

            <div class="col-md-6">
                <label class="form-label" for="kategori_id">Kategori</label>
                <select name="kategori_id" id="kategori_id" class="form-select">
                    <option value="">-- Pilih Kategori --</option>
                    @foreach ($kategoris as $kat)
                        <option value="{{ $kat->kategori_id }}">{{ $kat->nama }}</option>
                    @endforeach
                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label" for="status">Status</label>
                <input type="text" name="status" id="status" class="form-control" placeholder="mis: aktif/draft">
            </div>

            <div class="col-12">
                <label class="form-label" for="deskripsi">Deskripsi</label>
                <textarea name="deskripsi" id="deskripsi" rows="3" class="form-control"></textarea>
            </div>

            <div class="col-12">
                <label class="form-label" for="file">Pilih File</label>
                <input type="file" name="file" id="file" class="form-control" required>
                <div class="form-text">Maks 10 MB.</div>
            </div>
        </div>

        <div class="mt-3">
            <button class="btn btn-primary">Upload</button>
        </div>
    </form>

    <h4>Daftar Dokumen</h4>
    <div class="table-responsive">
        <table class="table table-bordered align-middle">
            <thead class="table-light">
                <tr>
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>Nomor</th>
                    <th>Terbit</th>
                    <th>Link File</th>
                    <th style="width: 110px;">Aksi</th>
                </tr>
            </thead>
            <tbody>
            @forelse($dokumens as $d)
                <tr>
                    <td>{{ $d->judul }}</td>
                    <td>{{ optional($d->kategori)->nama ?? '-' }}</td>
                    <td>{{ $d->nomor_dokumen ?? '-' }}</td>
                    <td>{{ $d->tanggal_terbit?->format('Y-m-d') ?? '-' }}</td>
                    <td>
                        @if ($d->url)
                            <a href="{{ $d->url }}" target="_blank" rel="noopener noreferrer">Lihat</a>
                        @else
                            <span class="text-muted">—</span>
                        @endif
                    </td>
                    <td class="d-flex gap-2">
                        @if ($d->url)
                            <a class="btn btn-outline-primary btn-sm" href="{{ route('dokumen.show', $d->dokumen_id) }}" target="_blank">Open</a>
                        @endif
                        <form action="{{ route('dokumen.destroy', $d->dokumen_id) }}" method="POST" onsubmit="return confirm('Hapus dokumen ini?')">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-danger btn-sm">Hapus</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="6" class="text-center text-muted">Belum ada dokumen.</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>
</div>
</body>
</html>
